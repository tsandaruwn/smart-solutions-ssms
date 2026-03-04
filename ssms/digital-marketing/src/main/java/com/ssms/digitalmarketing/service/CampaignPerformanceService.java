package com.ssms.digitalmarketing.service;

import com.ssms.digitalmarketing.dto.PerformanceResponse;
import com.ssms.digitalmarketing.dto.RecordPerformanceRequest;
import com.ssms.digitalmarketing.entity.Campaign;
import com.ssms.digitalmarketing.entity.CampaignPerformance;
import com.ssms.digitalmarketing.exception.CampaignNotFoundException;
import com.ssms.digitalmarketing.repository.CampaignPerformanceRepository;
import com.ssms.digitalmarketing.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CampaignPerformanceService {

    private final CampaignPerformanceRepository performanceRepository;
    private final CampaignRepository campaignRepository;

    // ─── RECORD / UPSERT ─────────────────────────────────────────

    /**
     * Record a daily performance snapshot.
     * If a snapshot for the same campaign+date already exists, it is updated.
     */
    @Transactional
    public PerformanceResponse recordPerformance(Integer campaignId, RecordPerformanceRequest request) {
        Campaign campaign = findCampaignOrThrow(campaignId);

        // Check for duplicate (upsert semantics: update if exists)
        CampaignPerformance perf = performanceRepository
                .findByCampaignCampaignIdAndRecordedDate(campaignId, request.getRecordedDate())
                .orElse(CampaignPerformance.builder()
                        .campaign(campaign)
                        .recordedDate(request.getRecordedDate())
                        .impressions(0)
                        .clicks(0)
                        .conversions(0)
                        .revenueGenerated(BigDecimal.ZERO)
                        .costIncurred(BigDecimal.ZERO)
                        .build());

        perf.setImpressions(request.getImpressions() != null ? request.getImpressions() : 0);
        perf.setClicks(request.getClicks() != null ? request.getClicks() : 0);
        perf.setConversions(request.getConversions() != null ? request.getConversions() : 0);
        perf.setRevenueGenerated(
                request.getRevenueGenerated() != null ? request.getRevenueGenerated() : BigDecimal.ZERO);
        perf.setCostIncurred(request.getCostIncurred() != null ? request.getCostIncurred() : BigDecimal.ZERO);

        CampaignPerformance saved = performanceRepository.save(perf);
        log.info("Performance recorded: campaignId={}, date={}", campaignId, request.getRecordedDate());
        return PerformanceResponse.fromEntity(saved);
    }

    // ─── READ ────────────────────────────────────────────────────

    /**
     * Get all performance snapshots for a campaign.
     */
    @Transactional(readOnly = true)
    public List<PerformanceResponse> getPerformanceByCampaign(Integer campaignId) {
        findCampaignOrThrow(campaignId);
        return performanceRepository
                .findByCampaignCampaignIdOrderByRecordedDateAsc(campaignId)
                .stream()
                .map(PerformanceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get performance snapshots for a campaign within a date range.
     */
    @Transactional(readOnly = true)
    public List<PerformanceResponse> getPerformanceByCampaignAndDateRange(
            Integer campaignId, LocalDate from, LocalDate to) {
        findCampaignOrThrow(campaignId);
        return performanceRepository
                .findByCampaignCampaignIdAndRecordedDateBetweenOrderByRecordedDateAsc(campaignId, from, to)
                .stream()
                .map(PerformanceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get aggregate performance summary for a campaign.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getCampaignSummary(Integer campaignId) {
        Campaign campaign = findCampaignOrThrow(campaignId);
        List<Object[]> rows = performanceRepository.aggregateByCampaignId(campaignId);
        Object[] row = (rows != null && !rows.isEmpty() && rows.get(0) != null)
                ? rows.get(0)
                : new Object[]{ null, null, null, null, null };

        long totalImpressions = toLong(row[0]);
        long totalClicks = toLong(row[1]);
        long totalConversions = toLong(row[2]);
        BigDecimal totalRevenue = toBigDecimal(row[3]);
        BigDecimal totalCost = toBigDecimal(row[4]);

        double ctr = totalImpressions > 0
                ? (double) totalClicks / totalImpressions * 100
                : 0.0;
        double convRate = totalClicks > 0
                ? (double) totalConversions / totalClicks * 100
                : 0.0;
        double roas = totalCost.compareTo(BigDecimal.ZERO) > 0
                ? totalRevenue.divide(totalCost, 4, java.math.RoundingMode.HALF_UP).doubleValue()
                : 0.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("campaignId", campaignId);
        summary.put("campaignName", campaign.getName());
        summary.put("totalImpressions", totalImpressions);
        summary.put("totalClicks", totalClicks);
        summary.put("totalConversions", totalConversions);
        summary.put("totalRevenue", totalRevenue);
        summary.put("totalCost", totalCost);
        summary.put("clickThroughRate", String.format("%.2f%%", ctr));
        summary.put("conversionRate", String.format("%.2f%%", convRate));
        summary.put("roas", String.format("%.4f", roas));
        return summary;
    }

    // ─── DELETE ──────────────────────────────────────────────────

    @Transactional
    public void deletePerformanceEntry(Integer perfId) {
        CampaignPerformance perf = performanceRepository.findById(perfId)
                .orElseThrow(() -> new IllegalArgumentException("Performance entry not found: " + perfId));
        performanceRepository.delete(perf);
        log.info("Performance entry deleted: perfId={}", perfId);
    }

    // ─── Helpers ─────────────────────────────────────────────────

    private Campaign findCampaignOrThrow(Integer campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new CampaignNotFoundException(
                        "Campaign not found with id: " + campaignId));
        if (campaign.getDeletedAt() != null) {
            throw new CampaignNotFoundException("Campaign not found with id: " + campaignId);
        }
        return campaign;
    }

    private long toLong(Object val) {
        return val != null ? ((Number) val).longValue() : 0L;
    }

    private BigDecimal toBigDecimal(Object val) {
        if (val == null)
            return BigDecimal.ZERO;
        return val instanceof BigDecimal ? (BigDecimal) val : new BigDecimal(val.toString());
    }
}
