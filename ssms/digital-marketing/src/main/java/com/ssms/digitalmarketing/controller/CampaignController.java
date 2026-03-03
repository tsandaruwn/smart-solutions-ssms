package com.ssms.digitalmarketing.controller;

import com.ssms.digitalmarketing.dto.CampaignResponse;
import com.ssms.digitalmarketing.dto.CreateCampaignRequest;
import com.ssms.digitalmarketing.dto.UpdateCampaignRequest;
import com.ssms.digitalmarketing.entity.CampaignStatus;
import com.ssms.digitalmarketing.service.CampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for Campaign operations.
 *
 * Base path: /api/campaigns
 */
@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CampaignController {

    private final CampaignService campaignService;

    // ─── CREATE ──────────────────────────────────────────────────

    /**
     * Create a new campaign.
     * POST /api/campaigns
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createCampaign(
            @Valid @RequestBody CreateCampaignRequest request) {
        CampaignResponse campaign = campaignService.createCampaign(request);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Campaign created successfully");
        response.put("campaign", campaign);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ─── READ ────────────────────────────────────────────────────

    /**
     * Get all campaigns (non-deleted).
     * GET /api/campaigns
     */
    @GetMapping
    public ResponseEntity<List<CampaignResponse>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    /**
     * Get a campaign by ID.
     * GET /api/campaigns/{campaignId}
     */
    @GetMapping("/{campaignId}")
    public ResponseEntity<CampaignResponse> getCampaignById(@PathVariable Integer campaignId) {
        return ResponseEntity.ok(campaignService.getCampaignById(campaignId));
    }

    /**
     * Get campaigns created by a specific user (marketing manager).
     * GET /api/campaigns/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CampaignResponse>> getCampaignsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(campaignService.getCampaignsByUser(userId));
    }

    /**
     * Get campaigns by status.
     * GET /api/campaigns/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CampaignResponse>> getCampaignsByStatus(
            @PathVariable CampaignStatus status) {
        return ResponseEntity.ok(campaignService.getCampaignsByStatus(status));
    }

    // ─── UPDATE ──────────────────────────────────────────────────

    /**
     * Update an existing campaign.
     * PUT /api/campaigns/{campaignId}
     */
    @PutMapping("/{campaignId}")
    public ResponseEntity<Map<String, Object>> updateCampaign(
            @PathVariable Integer campaignId,
            @Valid @RequestBody UpdateCampaignRequest request) {
        CampaignResponse updated = campaignService.updateCampaign(campaignId, request);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Campaign updated successfully");
        response.put("campaign", updated);
        return ResponseEntity.ok(response);
    }

    /**
     * Change campaign status.
     * PATCH /api/campaigns/{campaignId}/status
     */
    @PatchMapping("/{campaignId}/status")
    public ResponseEntity<Map<String, Object>> changeCampaignStatus(
            @PathVariable Integer campaignId,
            @RequestParam CampaignStatus status) {
        CampaignResponse updated = campaignService.changeCampaignStatus(campaignId, status);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Campaign status updated to " + status);
        response.put("campaign", updated);
        return ResponseEntity.ok(response);
    }

    // ─── DELETE ──────────────────────────────────────────────────

    /**
     * Soft-delete a campaign.
     * DELETE /api/campaigns/{campaignId}
     */
    @DeleteMapping("/{campaignId}")
    public ResponseEntity<Map<String, Object>> deleteCampaign(@PathVariable Integer campaignId) {
        campaignService.deleteCampaign(campaignId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Campaign deleted successfully");
        return ResponseEntity.ok(response);
    }
}
