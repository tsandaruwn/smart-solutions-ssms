package com.ssms.digitalmarketing.repository;

import com.ssms.digitalmarketing.entity.CampaignPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CampaignPerformanceRepository extends JpaRepository<CampaignPerformance, Integer> {

    /** All snapshots for a given campaign. */
    List<CampaignPerformance> findByCampaignCampaignIdOrderByRecordedDateAsc(Integer campaignId);

    /** Snapshot for a specific campaign + date (unique constraint). */
    Optional<CampaignPerformance> findByCampaignCampaignIdAndRecordedDate(Integer campaignId, LocalDate recordedDate);

    /** Snapshots for a campaign within a date range. */
    List<CampaignPerformance> findByCampaignCampaignIdAndRecordedDateBetweenOrderByRecordedDateAsc(
            Integer campaignId, LocalDate from, LocalDate to);

    /** Aggregate totals for a campaign. */
    @Query("""
            SELECT
              SUM(p.impressions)       AS totalImpressions,
              SUM(p.clicks)            AS totalClicks,
              SUM(p.conversions)       AS totalConversions,
              SUM(p.revenueGenerated)  AS totalRevenue,
              SUM(p.costIncurred)      AS totalCost
            FROM CampaignPerformance p
            WHERE p.campaign.campaignId = :campaignId
            """)
    List<Object[]> aggregateByCampaignId(@Param("campaignId") Integer campaignId);
}
