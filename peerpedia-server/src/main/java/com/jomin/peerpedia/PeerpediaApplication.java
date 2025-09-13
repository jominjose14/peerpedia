package com.jomin.peerpedia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan("com.jomin.peerpedia.data.entity")
@EnableJpaRepositories("com.jomin.peerpedia.data.repository")
@EnableJpaAuditing
@EnableScheduling
@EnableCaching
public class PeerpediaApplication {

	public static void main(String[] args) {
		SpringApplication.run(PeerpediaApplication.class, args);
	}

}
