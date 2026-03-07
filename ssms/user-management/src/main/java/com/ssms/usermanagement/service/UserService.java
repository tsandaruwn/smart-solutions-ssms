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

@Service
@Transactional
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	public List<UserResponseDTO> getAllUsers() {
		return userRepository.findAll().stream()
				.filter(user -> user.getDeletedAt() == null) 
				.map(UserMapper::toResponseDTO)
				.collect(Collectors.toList());
	}

	public UserResponseDTO getUserById(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id));
		
		if (user.getDeletedAt() != null) {
			throw new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id);
		}
		
		return UserMapper.toResponseDTO(user);
	}

	public UserResponseDTO createUser(UserRequestDTO requestDTO) {
		
		if (userRepository.existsByUsername(requestDTO.getUsername())) {
			throw new DuplicateResourceException(ResponseMessages.USERNAME_ALREADY_EXISTS);
		}
		
		if (userRepository.existsByEmail(requestDTO.getEmail())) {
			throw new DuplicateResourceException(ResponseMessages.EMAIL_ALREADY_EXISTS);
		}

		Role role = roleRepository.findById(requestDTO.getRoleId())
				.orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + requestDTO.getRoleId()));

		User user = new User();
		user.setUsername(requestDTO.getUsername());
		user.setEmail(requestDTO.getEmail());
		user.setPasswordHash(requestDTO.getPassword()); 
		user.setFirstName(requestDTO.getFirstName());
		user.setLastName(requestDTO.getLastName());
		user.setPhone(requestDTO.getPhone());
		user.setRole(role);
		user.setIsActive(true);

		User savedUser = userRepository.save(user);
		return UserMapper.toResponseDTO(savedUser);
	}

	public UserResponseDTO updateUser(Integer id, UserUpdateDTO updateDTO) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id));

		if (user.getDeletedAt() != null) {
			throw new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id);
		}

		if (updateDTO.getUsername() != null && !updateDTO.getUsername().equals(user.getUsername())) {
			if (userRepository.existsByUsername(updateDTO.getUsername())) {
				throw new DuplicateResourceException(ResponseMessages.USERNAME_ALREADY_EXISTS);
			}
			user.setUsername(updateDTO.getUsername());
		}

		if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(user.getEmail())) {
			if (userRepository.existsByEmail(updateDTO.getEmail())) {
				throw new DuplicateResourceException(ResponseMessages.EMAIL_ALREADY_EXISTS);
			}
			user.setEmail(updateDTO.getEmail());
		}

		if (updateDTO.getPassword() != null) {
			user.setPasswordHash(updateDTO.getPassword()); 
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

	public void deleteUser(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id));
		
		user.softDelete();
		userRepository.save(user);
	}

	public void hardDeleteUser(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + id));
		userRepository.delete(user);
	}

	public void updateLastLogin(Integer userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException(ResponseMessages.USER_NOT_FOUND + userId));
		user.setLastLogin(LocalDateTime.now());
		userRepository.save(user);
	}
}
