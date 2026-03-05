package com.ssms.customerservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import com.ssms.customerservice.client.OrderServiceClient;

@SpringBootTest
@ActiveProfiles("test")
class CustomerServiceApplicationTests {

	@MockitoBean
	private OrderServiceClient orderServiceClient;

	@Test
	void contextLoads() {
	}

}
