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

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CampaignController {

    private final CampaignService campaignService;

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

    @GetMapping
    public ResponseEntity<List<CampaignResponse>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @GetMapping("/{campaignId}")
    public ResponseEntity<CampaignResponse> getCampaignById(@PathVariable Integer campaignId) {
        return ResponseEntity.ok(campaignService.getCampaignById(campaignId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CampaignResponse>> getCampaignsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(campaignService.getCampaignsByUser(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CampaignResponse>> getCampaignsByStatus(
            @PathVariable CampaignStatus status) {
        return ResponseEntity.ok(campaignService.getCampaignsByStatus(status));
    }

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

    @DeleteMapping("/{campaignId}")
    public ResponseEntity<Map<String, Object>> deleteCampaign(@PathVariable Integer campaignId) {
        campaignService.deleteCampaign(campaignId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Campaign deleted successfully");
        return ResponseEntity.ok(response);
    }
}
