package ua.com.flowershop.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadPoolExecutor;


@EnableAsync
@EnableScheduling
@Configuration
public class ThreadPoolExecutorConfigurer implements AsyncConfigurer {

    @Value("${executor.async.pool.size}") private int asyncExecutorsPoolSize;
    @Value("${executor.scheduled.pool.size}") private int scheduledExecutorsPoolSize;

    @Override
    public ThreadPoolTaskExecutor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(asyncExecutorsPoolSize);
        executor.setAllowCoreThreadTimeOut(true);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setQueueCapacity(asyncExecutorsPoolSize);
        executor.setMaxPoolSize(asyncExecutorsPoolSize * 2);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }


    @Bean
    public ScheduledThreadPoolExecutor scheduledThreadPoolExecutor(){
        return new ScheduledThreadPoolExecutor(scheduledExecutorsPoolSize);
    }

}
