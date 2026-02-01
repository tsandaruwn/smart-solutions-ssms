
package com.ssms.usermanagement.controller;

import com.ssms.usermanagement.dto.UserRequestDTO;
import com.ssms.usermanagement.dto.UserResponseDTO;
import com.ssms.usermanagement.dto.UserUpdateDTO;
import com.ssms.usermanagement.service.UserService;
import com.ssms.usermanagement.util.ApiResponse;
import com.ssms.usermanagement.util.ResponseMessages;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for User Management
 * All endpoints use DTOs and standardized responses
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

	@Autowired
	private UserService userService;

	/**
	 * Get all users
	 * GET /api/users
	 */
	@GetMapping
	public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUsers() {
		List<UserResponseDTO> users = userService.getAllUsers();
		ApiResponse<List<UserResponseDTO>> response = ApiResponse.success(
			ResponseMessages.USERS_RETRIEVED_SUCCESS, 
			users
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * Get user by ID
	 * GET /api/users/{id}
	 */
	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {
		UserResponseDTO user = userService.getUserById(id);
		ApiResponse<UserResponseDTO> response = ApiResponse.success(
			ResponseMessages.USER_RETRIEVED_SUCCESS, 
			user
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * Create new user
	 * POST /api/users
	 */
	@PostMapping
	public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(@Valid @RequestBody UserRequestDTO requestDTO) {
		UserResponseDTO createdUser = userService.createUser(requestDTO);
		ApiResponse<UserResponseDTO> response = ApiResponse.success(
			ResponseMessages.USER_CREATED_SUCCESS, 
			createdUser
		);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	/**
	 * Update existing user
	 * PUT /api/users/{id}
	 */
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(
			@PathVariable Long id, 
			@Valid @RequestBody UserUpdateDTO updateDTO) {
		UserResponseDTO updatedUser = userService.updateUser(id, updateDTO);
		ApiResponse<UserResponseDTO> response = ApiResponse.success(
			ResponseMessages.USER_UPDATED_SUCCESS, 
			updatedUser
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * Delete user
	 * DELETE /api/users/{id}
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);
		ApiResponse<Void> response = ApiResponse.success(ResponseMessages.USER_DELETED_SUCCESS);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}

