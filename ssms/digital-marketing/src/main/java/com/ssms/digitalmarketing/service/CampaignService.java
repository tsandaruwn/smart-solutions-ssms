package com.ssms.digitalmarketing.service;

import com.ssms.digitalmarketing.dto.CampaignResponse;
import com.ssms.digitalmarketing.dto.CreateCampaignRequest;
import com.ssms.digitalmarketing.dto.UpdateCampaignRequest;
import com.ssms.digitalmarketing.entity.Campaign;
import com.ssms.digitalmarketing.entity.CampaignStatus;
import com.ssms.digitalmarketing.exception.CampaignNotFoundException;
import com.ssms.digitalmarketing.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CampaignService {

    private final CampaignRepository campaignRepository;

    @Transactional
    public CampaignResponse createCampaign(CreateCampaignRequest request) {
        validateDateRange(request.getStartDate(), request.getEndDate());

        Campaign campaign = Campaign.builder()
                .createdByUserId(request.getCreatedByUserId())
                .name(request.getName())
                .type(request.getType())
                .description(request.getDescription())
                .targetAudience(request.getTargetAudience())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .status(request.getStatus() != null ? request.getStatus() : CampaignStatus.DRAFT)
                .build();

        Campaign saved = campaignRepository.save(campaign);
        log.info("Campaign created: id={}, name={}", saved.getCampaignId(), saved.getName());
        return CampaignResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public CampaignResponse getCampaignById(Integer campaignId) {
        return CampaignResponse.fromEntity(findActiveOrThrow(campaignId));
    }

    @Transactional(readOnly = true)
    public List<CampaignResponse> getAllCampaigns() {
        return campaignRepository.findAllByDeletedAtIsNull().stream()
                .map(CampaignResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CampaignResponse> getCampaignsByUser(Integer userId) {
        return campaignRepository.findByCreatedByUserIdAndDeletedAtIsNull(userId).stream()
                .map(CampaignResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CampaignResponse> getCampaignsByStatus(CampaignStatus status) {
        return campaignRepository.findByStatusAndDeletedAtIsNull(status).stream()
                .map(CampaignResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CampaignResponse updateCampaign(Integer campaignId, UpdateCampaignRequest request) {
        Campaign campaign = findActiveOrThrow(campaignId);

        if (request.getName() != null)
            campaign.setName(request.getName());
        if (request.getType() != null)
            campaign.setType(request.getType());
        if (request.getDescription() != null)
            campaign.setDescription(request.getDescription());
        if (request.getTargetAudience() != null)
            campaign.setTargetAudience(request.getTargetAudience());
        if (request.getStartDate() != null)
            campaign.setStartDate(request.getStartDate());
        if (request.getEndDate() != null)
            campaign.setEndDate(request.getEndDate());
        if (request.getBudget() != null)
            campaign.setBudget(request.getBudget());
        if (request.getStatus() != null)
            campaign.setStatus(request.getStatus());

        if (campaign.getStartDate() != null && campaign.getEndDate() != null) {
            validateDateRange(campaign.getStartDate(), campaign.getEndDate());
        }

        Campaign saved = campaignRepository.save(campaign);
        log.info("Campaign updated: id={}", saved.getCampaignId());
        return CampaignResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteCampaign(Integer campaignId) {
        Campaign campaign = findActiveOrThrow(campaignId);
        campaign.setDeletedAt(LocalDateTime.now());
        campaignRepository.save(campaign);
        log.info("Campaign soft-deleted: id={}", campaignId);
    }

    @Transactional
    public CampaignResponse changeCampaignStatus(Integer campaignId, CampaignStatus newStatus) {
        Campaign campaign = findActiveOrThrow(campaignId);
        campaign.setStatus(newStatus);
        Campaign saved = campaignRepository.save(campaign);
        log.info("Campaign status changed: id={}, status={}", campaignId, newStatus);
        return CampaignResponse.fromEntity(saved);
    }

    private Campaign findActiveOrThrow(Integer campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new CampaignNotFoundException(
                        "Campaign not found with id: " + campaignId));
        if (campaign.getDeletedAt() != null) {
            throw new CampaignNotFoundException("Campaign not found with id: " + campaignId);
        }
        return campaign;
    }

    private void validateDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must not be before start date");
        }
    }
}
