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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/users", produces = "application/json")
@CrossOrigin(origins = "*")
public class UserController {

	@Autowired
	private UserService userService;

	@GetMapping
	public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getAllUsers() {
		List<UserResponseDTO> users = userService.getAllUsers();
		ApiResponse<List<UserResponseDTO>> response = ApiResponse.success(
			ResponseMessages.USERS_RETRIEVED_SUCCESS, 
			users
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable Integer id) {
		UserResponseDTO user = userService.getUserById(id);
		ApiResponse<UserResponseDTO> response = ApiResponse.success(
			ResponseMessages.USER_RETRIEVED_SUCCESS, 
			user
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(@Valid @RequestBody UserRequestDTO requestDTO) {
		UserResponseDTO createdUser = userService.createUser(requestDTO);
		ApiResponse<UserResponseDTO> response = ApiResponse.success(
			ResponseMessages.USER_CREATED_SUCCESS, 
			createdUser
		);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(
			@PathVariable Integer id, 
			@Valid @RequestBody UserUpdateDTO updateDTO) {
		UserResponseDTO updatedUser = userService.updateUser(id, updateDTO);
		ApiResponse<UserResponseDTO> response = ApiResponse.success(
			ResponseMessages.USER_UPDATED_SUCCESS, 
			updatedUser
		);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Integer id) {
		userService.deleteUser(id);
		ApiResponse<Void> response = ApiResponse.success(ResponseMessages.USER_DELETED_SUCCESS);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@DeleteMapping("/{id}/hard")
	public ResponseEntity<ApiResponse<Void>> hardDeleteUser(@PathVariable Integer id) {
		userService.hardDeleteUser(id);
		ApiResponse<Void> response = ApiResponse.success("User permanently deleted successfully");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/{id}/login")
	public ResponseEntity<ApiResponse<Void>> updateLastLogin(@PathVariable Integer id) {
		userService.updateLastLogin(id);
		ApiResponse<Void> response = ApiResponse.success("Last login updated successfully");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
