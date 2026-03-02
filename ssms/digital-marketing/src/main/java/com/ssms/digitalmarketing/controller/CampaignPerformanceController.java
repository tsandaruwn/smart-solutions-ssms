package com.ssms.digitalmarketing.controller;

import com.ssms.digitalmarketing.dto.PerformanceResponse;
import com.ssms.digitalmarketing.dto.RecordPerformanceRequest;
import com.ssms.digitalmarketing.service.CampaignPerformanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for Campaign Performance operations.
 *
 * Base path: /api/campaigns/{campaignId}/performance
 */
@RestController
@RequestMapping("/api/campaigns/{campaignId}/performance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CampaignPerformanceController {

    private final CampaignPerformanceService performanceService;

    // ─── RECORD ──────────────────────────────────────────────────

    /**
     * Record (or update) a daily performance snapshot.
     * POST /api/campaigns/{campaignId}/performance
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> recordPerformance(
            @PathVariable Integer campaignId,
            @Valid @RequestBody RecordPerformanceRequest request) {
        PerformanceResponse perf = performanceService.recordPerformance(campaignId, request);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Performance snapshot recorded");
        response.put("performance", perf);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── READ ────────────────────────────────────────────────────

    /**
     * Get all performance records for a campaign.
     * GET /api/campaigns/{campaignId}/performance
     */
    @GetMapping
    public ResponseEntity<List<PerformanceResponse>> getPerformance(@PathVariable Integer campaignId) {
        return ResponseEntity.ok(performanceService.getPerformanceByCampaign(campaignId));
    }

    /**
     * Get performance records within a date range.
     * GET
     * /api/campaigns/{campaignId}/performance/range?from=YYYY-MM-DD&to=YYYY-MM-DD
     */
    @GetMapping("/range")
    public ResponseEntity<List<PerformanceResponse>> getPerformanceRange(
            @PathVariable Integer campaignId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(
                performanceService.getPerformanceByCampaignAndDateRange(campaignId, from, to));
    }

    /**
     * Get aggregate performance summary for a campaign.
     * GET /api/campaigns/{campaignId}/performance/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@PathVariable Integer campaignId) {
        return ResponseEntity.ok(performanceService.getCampaignSummary(campaignId));
    }

    // ─── DELETE ──────────────────────────────────────────────────

    /**
     * Delete a specific performance entry by its ID.
     * DELETE /api/campaigns/{campaignId}/performance/{perfId}
     */
    @DeleteMapping("/{perfId}")
    public ResponseEntity<Map<String, Object>> deletePerformanceEntry(
            @PathVariable Integer campaignId,
            @PathVariable Integer perfId) {
        performanceService.deletePerformanceEntry(perfId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Performance entry deleted");
        return ResponseEntity.ok(response);
    }
}
