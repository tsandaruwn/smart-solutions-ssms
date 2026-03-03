
package com.ssms.usermanagement.service;

import com.ssms.usermanagement.dto.UserRequestDTO;
import com.ssms.usermanagement.dto.UserResponseDTO;
import com.ssms.usermanagement.dto.UserUpdateDTO;
import com.ssms.usermanagement.entity.User;
import com.ssms.usermanagement.entity.Role;
import com.ssms.usermanagement.exception.DuplicateResourceException;
import com.ssms.usermanagement.exception.ResourceNotFoundException;
import com.ssms.usermanagement.repository.UserRepository;
import com.ssms.usermanagement.repository.RoleRepository;
import com.ssms.usermanagement.util.ResponseMessages;
import com.ssms.usermanagement.util.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for User management
 * Handles business logic and validation
 */
@Service
@Transactional
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	/**
	 * Get all users
	 */
	public List<UserResponseDTO> getAllUsers() {
		return userRepository.findAll().stream()
				.filter(user -> user.getDeletedAt() == null) // Exclude soft-deleted users
				.map(UserMapper::toResponseDTO)
				.collect(Collectors.toList());
	}

	/**
	 * Get user by ID
	 */
	public UserResponseDTO getUserById(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id));
		
		if (user.getDeletedAt() != null) {
			throw new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id);
		}
		
		return UserMapper.toResponseDTO(user);
	}

	/**
	 * Create new user
	 */
	public UserResponseDTO createUser(UserRequestDTO requestDTO) {
		// Check for duplicate username
		if (userRepository.existsByUsername(requestDTO.getUsername())) {
			throw new DuplicateResourceException(ResponseMessages.USERNAME_ALREADY_EXISTS);
		}
		
		// Check for duplicate email
		if (userRepository.existsByEmail(requestDTO.getEmail())) {
			throw new DuplicateResourceException(ResponseMessages.EMAIL_ALREADY_EXISTS);
		}

		// Fetch the role
		Role role = roleRepository.findById(requestDTO.getRoleId())
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + requestDTO.getRoleId()));

		// Create new user entity
		User user = new User();
		user.setUsername(requestDTO.getUsername());
		user.setEmail(requestDTO.getEmail());
		user.setPasswordHash(requestDTO.getPassword()); // In production, hash the password properly
		user.setFirstName(requestDTO.getFirstName());
		user.setLastName(requestDTO.getLastName());
		user.setPhone(requestDTO.getPhone());
		user.setRole(role);
		user.setIsActive(true);

		User savedUser = userRepository.save(user);
		return UserMapper.toResponseDTO(savedUser);
	}

	/**
	 * Update existing user
	 */
	public UserResponseDTO updateUser(Integer id, UserUpdateDTO updateDTO) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id));

		if (user.getDeletedAt() != null) {
			throw new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id);
		}

		// Check for duplicate username if updating
		if (updateDTO.getUsername() != null && !updateDTO.getUsername().equals(user.getUsername())) {
			if (userRepository.existsByUsername(updateDTO.getUsername())) {
				throw new DuplicateResourceException(ResponseMessages.USERNAME_ALREADY_EXISTS);
			}
			user.setUsername(updateDTO.getUsername());
		}

		// Check for duplicate email if updating
		if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(user.getEmail())) {
			if (userRepository.existsByEmail(updateDTO.getEmail())) {
				throw new DuplicateResourceException(ResponseMessages.EMAIL_ALREADY_EXISTS);
			}
			user.setEmail(updateDTO.getEmail());
		}

		// Update other fields if provided
		if (updateDTO.getPassword() != null) {
			user.setPasswordHash(updateDTO.getPassword()); // In production, hash the password
		}
		if (updateDTO.getFirstName() != null) {
			user.setFirstName(updateDTO.getFirstName());
		}
		if (updateDTO.getLastName() != null) {
			user.setLastName(updateDTO.getLastName());
		}
		if (updateDTO.getPhone() != null) {
			user.setPhone(updateDTO.getPhone());
		}
		if (updateDTO.getRoleId() != null) {
			Role role = roleRepository.findById(updateDTO.getRoleId())
					.orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + updateDTO.getRoleId()));
			user.setRole(role);
		}
		if (updateDTO.getIsActive() != null) {
			user.setIsActive(updateDTO.getIsActive());
		}

		User updatedUser = userRepository.save(user);
		return UserMapper.toResponseDTO(updatedUser);
	}

	/**
	 * Soft delete user by ID
	 */
	public void deleteUser(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id));
		
		// Soft delete
		user.softDelete();
		userRepository.save(user);
	}

	/**
	 * Hard delete user by ID (permanent deletion)
	 */
	public void hardDeleteUser(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id));
		userRepository.delete(user);
	}

	/**
	 * Update last login time
	 */
	public void updateLastLogin(Integer userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + userId));
		user.setLastLogin(LocalDateTime.now());
		userRepository.save(user);
	}
}

