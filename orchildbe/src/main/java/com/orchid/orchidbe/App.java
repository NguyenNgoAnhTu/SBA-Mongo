package com.orchid.orchidbe;

import com.orchid.orchidbe.pojos.Account;
import com.orchid.orchidbe.pojos.Category;
import com.orchid.orchidbe.pojos.Orchid;
import com.orchid.orchidbe.pojos.Role;
import com.orchid.orchidbe.repositories.AccountRepository;
import com.orchid.orchidbe.repositories.CategoryRepository;
import com.orchid.orchidbe.repositories.OrchidRepository;
import com.orchid.orchidbe.repositories.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@SpringBootApplication
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class App implements CommandLineRunner {
    RoleRepository roleRepository;
    AccountRepository accountRepository;
    CategoryRepository categoryRepository;
    OrchidRepository orchidRepository;
    PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.findByName("USER").isEmpty()) {
            Role userRole = new Role("USER");
            roleRepository.save(userRole);
        }

        if (roleRepository.findByName("ADMIN").isEmpty()) {
            Role adminRole = new Role("ADMIN");
            roleRepository.save(adminRole);
        }

        if (accountRepository.findAll().isEmpty()) {
            Account user = new Account();
            user.setName("user");
            user.setEmail("user@gmail.com");
            user.setRole(roleRepository.findByName("USER").get());
            user.setPassword(passwordEncoder.encode("12345"));

            Account admin = new Account();
            admin.setName("admin");
            admin.setEmail("admin@gmail.com");
            admin.setRole(roleRepository.findByName("ADMIN").get());
            admin.setPassword(passwordEncoder.encode("12345"));

            accountRepository.save(user);
            accountRepository.save(admin);
        }

        if (categoryRepository.findAll().isEmpty()) {
            Category categoryI = new Category();
            categoryI.setName("I");
            Category categoryII = new Category();
            categoryII.setName("II");
            Category categoryIII = new Category();
            categoryIII.setName("III");

            categoryRepository.save(categoryI);
            categoryRepository.save(categoryII);
            categoryRepository.save(categoryIII);
        }

        if (orchidRepository.findAll().isEmpty()) {
            Orchid orchidI = new Orchid();
            orchidI.setNatural(true);
            orchidI.setDescription("Orchid");
            orchidI.setName("Orchid I");
            orchidI.setUrl("https://th.bing.com/th/id/R.e0253cdb4cc75ab1356d2c835604eb7c?rik=tMnbtFLSoFYEDw&riu=http%3a%2f%2f3.bp.blogspot.com%2f-rLeZixCHerY%2fVmrFC4_POOI%2fAAAAAAAAAak%2fmaosogBzLAw%2fs1600%2fanh-hoa-lan-1.jpg&ehk=lUbijsWu6umgyndthfIQMtWZC8OcxhpLPh5iK0LZSyI%3d&risl=&pid=ImgRaw&r=0");
            orchidI.setPrice(100000);
            orchidI.setAvailable(true);
            orchidI.setCategory(categoryRepository.findByName("I").get());

            Orchid orchidII = new Orchid();
            orchidII.setNatural(true);
            orchidII.setDescription("Orchid");
            orchidII.setName("Orchid II");
            orchidII.setUrl("https://hanoispiritofplace.com/wp-content/uploads/2017/06/anh-hoa-lan-dep-41.jpg");
            orchidII.setPrice(220000);
            orchidII.setAvailable(true);
            orchidII.setCategory(categoryRepository.findByName("II").get());

            Orchid orchidIII = new Orchid();
            orchidIII.setNatural(true);
            orchidIII.setDescription("Orchid");
            orchidIII.setName("Orchid III");
            orchidIII.setUrl("https://th.bing.com/th/id/OIP.ITTYDx5aTfPQw-HRENh6dgHaFj?r=0&w=736&h=552&rs=1&pid=ImgDetMain&cb=idpwebpc2");
            orchidIII.setPrice(350000);
            orchidIII.setAvailable(true);
            orchidIII.setCategory(categoryRepository.findByName("III").get());

            orchidRepository.save(orchidI);
            orchidRepository.save(orchidII);
            orchidRepository.save(orchidIII);
        }
    }
}
