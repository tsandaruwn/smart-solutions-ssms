package com.ssms.digitalmarketing.repository;

import com.ssms.digitalmarketing.entity.Campaign;
import com.ssms.digitalmarketing.entity.CampaignStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer> {

    List<Campaign> findAllByDeletedAtIsNull();

    List<Campaign> findByCreatedByUserIdAndDeletedAtIsNull(Integer createdByUserId);

    List<Campaign> findByStatusAndDeletedAtIsNull(CampaignStatus status);
}
