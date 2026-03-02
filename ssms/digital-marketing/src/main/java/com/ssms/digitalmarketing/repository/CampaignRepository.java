package com.ssms.digitalmarketing.repository;

import com.ssms.digitalmarketing.entity.Campaign;
import com.ssms.digitalmarketing.entity.CampaignStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer> {

    /** Active (non-deleted) campaigns only. */
    List<Campaign> findAllByDeletedAtIsNull();

    /** Campaigns by a specific marketing manager. */
    List<Campaign> findByCreatedByUserIdAndDeletedAtIsNull(Integer createdByUserId);

    /** Campaigns by status (active only). */
    List<Campaign> findByStatusAndDeletedAtIsNull(CampaignStatus status);
}
