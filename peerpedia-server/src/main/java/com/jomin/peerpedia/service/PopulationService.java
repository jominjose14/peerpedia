package com.jomin.peerpedia.service;

import com.jomin.peerpedia.controller.AuthController;
import com.jomin.peerpedia.data.entity.ChatMessage;
import com.jomin.peerpedia.data.entity.Skill;
import com.jomin.peerpedia.data.entity.User;
import com.jomin.peerpedia.data.repository.ChatMessageRepository;
import com.jomin.peerpedia.data.repository.SkillRepository;
import com.jomin.peerpedia.data.repository.UserRepository;
import com.jomin.peerpedia.dto.SignupRequest;
import com.jomin.peerpedia.dto.UpdateUserRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
@Service
public class PopulationService {

    private static final String password = "pwpwpwpw";
    private static final String skillsFile = "skills.txt";
    private static final String usernamesFile = "usernames.txt";
    private static List<String> skillNames;

    @Value("${app.population.user-include-count}")
    private int usernamesFileIncludeCount;

    @Autowired
    private AuthController authController;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private SkillRepository skillRepository;

    private Optional<List<String>> readLinesFromResourceFile(Path path) {
        Optional<List<String>> result = Optional.empty();
        ClassPathResource resource = new ClassPathResource(path.toString());
        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            String content = FileCopyUtils.copyToString(reader);
            result = Optional.of(Arrays.asList(content.split("\\r?\\n")));
        } catch (Exception ex) {
            log.error("Failed to read lines from resource file {}", path, ex);
        }
        return result;
    }

    private int populateSkills() {
        try {
            long skillCount = skillRepository.count();
            if(0 < skillCount) {
                log.info("{} skills already populated, stopping skill population prematurely", skillCount);
                return 0;
            }
        } catch(Exception ex) {
            log.error("Failed to check if skills exist", ex);
            return 0;
        }

        Path skillsFilePath = Paths.get(skillsFile);
        var skillNamesOptional = readLinesFromResourceFile(skillsFilePath);
        if(skillNamesOptional.isEmpty()) {
            return 0;
        } else {
            skillNames = skillNamesOptional.get();
        }

        int populatedSkillsCount = 0;
        for(String skillName : skillNames) {
            Skill skill = new Skill();
            skill.setName(skillName);
            try {
                skillRepository.save(skill);
                populatedSkillsCount++;
            } catch(Exception ex) {
                log.error("Failed to populate skill {}", skillName, ex);
            }
        }

        return populatedSkillsCount;
    }

    private void updateUser(String username, UpdateUserRequest updateUserRequest) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if(userOptional.isEmpty()) return;

        User user = userOptional.get();
        user.update(updateUserRequest);
        try {
            userRepository.save(user);
        } catch(Exception ex) {
            log.error("Failed to update user during data population", ex);
        }
    }

    private int populateUsers() {
        try {
            long userCount = userRepository.count();
            if(usernamesFileIncludeCount <= userCount) {
                log.info("Users already populated, skipping user population");
                return 0;
            }
        } catch(Exception ex) {
            log.info("Failed to get user count from db, skipping check and proceeding with user population", ex);
        }

        Map<SignupRequest, UpdateUserRequest> usersMap = new LinkedHashMap<>();

        Path usernamesFilePath = Paths.get(usernamesFile);
        var usernamesOptional = readLinesFromResourceFile(usernamesFilePath);
        if(usernamesOptional.isPresent() && skillNames != null && !skillNames.isEmpty()) {
            List<String> usernames = usernamesOptional.get();
            if(usernamesFileIncludeCount < usernames.size()) {
                usernames.subList(usernamesFileIncludeCount, usernames.size()).clear();
            }
            Random random = new Random();

            for(String username : usernames) {
                String cleanUsername = username.split(" ")[0].toLowerCase();
                List<String> allSkills = new ArrayList<>(skillNames);

                Set<String> teachSkills = new HashSet<>();
                int teachSkillsCount = random.nextInt(7) + 1;
                Collections.shuffle(allSkills);
                for(int i=0; i<teachSkillsCount; i++) {
                    if(allSkills.size() <= i) {
                        log.error("Too few skills to add to teach skills of user {}", cleanUsername);
                        break;
                    }
                    teachSkills.add(allSkills.get(i));
                }
                allSkills.removeAll(teachSkills);

                Set<String> learnSkills = new HashSet<>();
                int learnSkillsCount = random.nextInt(7) + 1;
                Collections.shuffle(allSkills);
                for(int i=0; i<learnSkillsCount; i++) {
                    if(allSkills.size() <= i) {
                        log.error("Too few skills to add to learn skills of user {}", cleanUsername);
                        break;
                    }
                    learnSkills.add(allSkills.get(i));
                }

                String bio;
                int dice = random.nextInt(100) + 1;
                String teachSkill = teachSkills.iterator().next();
                String learnSkill = learnSkills.iterator().next();
                if(dice <= 25) {
                    bio = String.format("Im an expert in %s. Im here to learn about %s and form connections in its professional space.", teachSkill, learnSkill);
                } else if(dice <= 50) {
                    bio = String.format("Hi, Im highly skilled in %s. I know the basics, but I want to expand my knowledge in %s.", teachSkill, learnSkill);
                } else if(dice <= 75) {
                    bio = String.format("I have 8 years of experience using %s. I would like to acquire expertise in %s from someone with similar years of experience using it", teachSkill, learnSkill);
                } else {
                    bio = String.format("Hello, %s is my main skill, and I teach it well. I'd like to learn more about %s to use it in an upcoming project.", teachSkill, learnSkill);
                }

                usersMap.put(new SignupRequest(cleanUsername, password), new UpdateUserRequest(cleanUsername + "@email.com", teachSkills, learnSkills, bio));
            }
        }

        usersMap.put(new SignupRequest("peter", password), new UpdateUserRequest("peter@email.com", new HashSet<>(Arrays.asList("React", "Angular", "Vue")), new HashSet<>(Arrays.asList("SpringBoot", "Django", "Flask")), "Hi, Im a seasoned frontend developer. I want to learn backend technologies to become a fullstack developer."));
        usersMap.put(new SignupRequest("holly", password), new UpdateUserRequest("holly@email.com", new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React")), new HashSet<>(Arrays.asList("Golang", "Docker", "Kubernetes", "PostgreSQL")), "I teach web technologies at a popular bootcamp. I want to learn PostgreSQL to eventually start teaching it to my students."));
        usersMap.put(new SignupRequest("sharon", password), new UpdateUserRequest("sharon@email.com", new HashSet<>(Arrays.asList("Laravel", "PostgreSQL", "MySQL", "Flask")), new HashSet<>(Arrays.asList("HBase", "Cassandra", "Kubernetes", "Kafka", "Oracle Relational DB")), "I can teach you PostgreSQL in depth as I am one of its core open-source contributors. I want to learn HBase at a similar depth to broaden my knowledge about columnar data stores."));
        usersMap.put(new SignupRequest("nikola", password), new UpdateUserRequest("nikola@email.com", new HashSet<>(Arrays.asList("JavaScript", "NodeJS", "Express", "React", "NextJS")), new HashSet<>(Arrays.asList("SpringBoot", "Docker", "Kubernetes", "Kafka", "Nginx", "Redis")), "I am a MERN stack developer with 5 years experience. I want to transition to Java Spring tech stack."));
        usersMap.put(new SignupRequest("paul", password), new UpdateUserRequest("paul@email.com", new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React")), new HashSet<>(Arrays.asList("SpringBoot", "Docker", "Kubernetes", "Kafka", "Nginx", "Redis")), "I am a UI/UX designer and frontend developer with 7 years experience. I want to learn about Java and SpringBoot to improve communication with my backend team that uses them."));
        usersMap.put(new SignupRequest("maisie", password), new UpdateUserRequest("maisie@email.com", new HashSet<>(Arrays.asList("C++", "Unreal Engine", "Win32", "QT")), new HashSet<>(Arrays.asList("C#", "Unity")), "I am a game developer at Epic Games. I can teach Unreal Engine well. I want to learn the Unity game engine in depth to start an indie game studio."));
        usersMap.put(new SignupRequest("sophie", password), new UpdateUserRequest("sophie@email.com", new HashSet<>(Arrays.asList("C#", "Unity", "C++", "Unreal Engine", "Win32", "QT")), new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript")), "I am a game developer at an indie studio with 12 years. I can teach Unity well. I want to learn web technologies to make a career transition."));
        usersMap.put(new SignupRequest("ralph", password), new UpdateUserRequest("ralph@email.com", new HashSet<>(Arrays.asList("C#", "Unity", "Win32")), new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React")), "I am a game developer lead. I teach Unity really well. I want to learn web technologies to make a career transition."));
        usersMap.put(new SignupRequest("david", password), new UpdateUserRequest("david@email.com", new HashSet<>(Arrays.asList("C++", "Unreal Engine", "Win32")), new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React", "NodeJS")), "I am a game developer intern. I can teach Unreal Engine and C++. I want to learn web technologies to make a career transition."));
        usersMap.put(new SignupRequest("bill", password), new UpdateUserRequest("bill@email.com", new HashSet<>(Arrays.asList("Android", "Flutter", "Java")), new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React", "NodeJS", "Express")), "I am an cross platform app developer. I teach Flutter the best. I want to learn web development to make a career transition."));
        usersMap.put(new SignupRequest("susan", password), new UpdateUserRequest("susan@email.com", new HashSet<>(Arrays.asList("React Native", "Flutter", "Java", "Swift")), new HashSet<>(Arrays.asList("React", "NodeJS", "Express", "NextJS")), "I am an cross platform app developer. I teach React Native the best. I want to learn web development to add to my freelance portfolio."));
        usersMap.put(new SignupRequest("samuel", password), new UpdateUserRequest("samuel@email.com", new HashSet<>(Arrays.asList("Angular", "SpringBoot")), new HashSet<>(Arrays.asList("Python", "Flask", "PyTorch")), "Hi, Im an experienced fullstack developer. I want to learn PyTorch to become an AI Engineer."));
        usersMap.put(new SignupRequest("jessica", password), new UpdateUserRequest("jessica@email.com", new HashSet<>(Arrays.asList("Angular", "SpringBoot")), new HashSet<>(Arrays.asList("Python", "Tensorflow", "Keras")), "Hi, Im a fullstack developer with 15 years of experience. I want to learn Tensorflow to transition into a career in AI."));
        usersMap.put(new SignupRequest("raymond", password), new UpdateUserRequest("raymond@email.com", new HashSet<>(Arrays.asList("React", "TailwindCSS", "Java", "SpringBoot")), new HashSet<>(Arrays.asList("Python", "Tensorflow", "Keras")), "Hi, Im a fullstack Java developer with 20 years of experience. I want to learn Python in depth to transition into a career in AI."));
        usersMap.put(new SignupRequest("simon", password), new UpdateUserRequest("simon@email.com", new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "Angular")), new HashSet<>(Arrays.asList("Golang", "Docker", "Kubernetes", "MySQL")), "I am a frontend developer at Google. I want to learn Golang to write internal tooling microservices for my team."));
        usersMap.put(new SignupRequest("rahul", password), new UpdateUserRequest("rahul@email.com", new HashSet<>(Arrays.asList("JavaScript", "Angular", "NodeJS")), new HashSet<>(Arrays.asList("Golang", "Docker", "Kubernetes")), "I am a fullstack developer at Netflix. I want to learn Golang to make myself more hirable."));
        usersMap.put(new SignupRequest("sushanth", password), new UpdateUserRequest("sushanth@email.com", new HashSet<>(Arrays.asList("JavaScript", "React", "NodeJS")), new HashSet<>(Arrays.asList("Golang", "Kubernetes")), "I am a React developer with 4 years experience. I want to learn Golang to become a fullstack developer and to contribute to the Kubernetes open-source project."));
        usersMap.put(new SignupRequest("prashanth", password), new UpdateUserRequest("prashanth@email.com", new HashSet<>(Arrays.asList("JavaScript", "React", "NodeJS")), new HashSet<>(Arrays.asList("Golang", "Kubernetes")), "I am a React developer with 4 years experience. I want to learn Golang to contribute to the Kubernetes open-source project."));
        usersMap.put(new SignupRequest("swapnil", password), new UpdateUserRequest("swapnil@email.com", new HashSet<>(Arrays.asList("Angular", "Java", "SpringBoot")), new HashSet<>(Arrays.asList("Unreal Engine", "C++", "C#")), "Hola, Im a Java developer. I can teach SpringBoot well. I want to learn Unreal Engine to transition into becoming a game developer."));
        usersMap.put(new SignupRequest("gayathri", password), new UpdateUserRequest("gayathri@email.com", new HashSet<>(Arrays.asList("JavaScript", "React", "Java", "SpringBoot")), new HashSet<>(Arrays.asList("Unity", "C++", "C#")), "Hello, Im a Java developer. I can teach SpringBoot well. I want to learn Unity to transition into becoming a game developer."));
        usersMap.put(new SignupRequest("duncan", password), new UpdateUserRequest("duncan@email.com", new HashSet<>(Arrays.asList("Django", "Python", "Flask", "Keras")), new HashSet<>(Arrays.asList("Vue", "JavaScript", "React", "TailwindCSS")), "I am a data engineer. I can teach Python well. I want to learn React in depth to become a fullstack web developer."));
        usersMap.put(new SignupRequest("emily", password), new UpdateUserRequest("emily@email.com", new HashSet<>(Arrays.asList("Python", "Tensorflow", "PyTorch")), new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React", "TailwindCSS")), "I am an ML engineer. I can teach PyTorch the best. I want to learn frontend web development to make UIs for my personal projects."));
        usersMap.put(new SignupRequest("ancy", password), new UpdateUserRequest("ancy@email.com", new HashSet<>(Arrays.asList("Python", "Tensorflow", "Keras")), new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React", "TailwindCSS")), "I am a data scientist. I can teach Keras the best. I want to learn frontend web development to make a career transition."));
        usersMap.put(new SignupRequest("delna", password), new UpdateUserRequest("delna@email.com", new HashSet<>(Arrays.asList("Python", "Tensorflow", "Flask")), new HashSet<>(Arrays.asList("HTML", "CSS", "JavaScript", "React", "TailwindCSS")), "I am a data analyst. I can teach Flask the best. I want to learn frontend web development as a hobby."));
        usersMap.put(new SignupRequest("ajin", password), new UpdateUserRequest("ajin@email.com", new HashSet<>(Arrays.asList("SvelteKit", "NodeJS", "Express", "NuxtJS", "Svelte", "Docker")), new HashSet<>(Arrays.asList("React", "TailwindCSS", "Flutter", "React Native")), "I am a frontend developer. I can teach Svelte the best. I want to learn React and React Native to be able to build cross platform apps."));
        usersMap.put(new SignupRequest("melvin", password), new UpdateUserRequest("melvin@email.com", new HashSet<>(Arrays.asList("Git", "Golang", "Express", "NuxtJS", "Svelte", "Docker")), new HashSet<>(Arrays.asList("React", "TailwindCSS", "Flutter", "React Native")), "I am a fullstack developer. I can teach Golang the best. I want to learn React and React Native to be able to build cross platform apps."));
        usersMap.put(new SignupRequest("anne", password), new UpdateUserRequest("anne@email.com", new HashSet<>(Arrays.asList("Git", "Golang", "Express", "PHP", "Svelte", "Docker")), new HashSet<>(Arrays.asList("React", "React Native", "Flutter")), "I am a backend developer. I can teach Golang the best. I want to learn Flutter to be able to build cross platform apps."));
        usersMap.put(new SignupRequest("shae", password), new UpdateUserRequest("shae@email.com", new HashSet<>(Arrays.asList("Git", "Golang", "Express", "Kubernetes", "Svelte", "Docker")), new HashSet<>(Arrays.asList("React", "React Native", "Flutter")), "I am a backend developer. I can teach Golang and Kubernetes really well. I want to learn Flutter to be able to build cross platform apps."));
        usersMap.put(new SignupRequest("thomas", password), new UpdateUserRequest("thomas@email.com", new HashSet<>(Arrays.asList("Git", "Golang", "Express", "Kubernetes", "Jenkins", "Docker")), new HashSet<>(Arrays.asList("React", "React Native", "Flutter")), "I am a backend developer. I can teach Golang and Docker really well. I want to learn Flutter to be able to build cross platform apps."));

        for(SignupRequest signupRequest : usersMap.keySet()) {
            UpdateUserRequest updateUserRequest = usersMap.get(signupRequest);
            try {
                authController.registerUser(signupRequest);
                updateUser(signupRequest.getUsername(), updateUserRequest);
            } catch(Exception ex) {
                log.error("Failed to populate user {}", signupRequest.getUsername(), ex);
            }
        }

        return usersMap.size();
    }

    private int populateChats() {
        int populatedChatsCount = 0;

        try {
            User paul = userRepository.findByUsername("paul").get();
            User thomas = userRepository.findByUsername("thomas").get();

            List<ChatMessage> messages = chatMessageRepository.findTop20ByIdBetweenAndFrom_IdAndTo_IdOrFrom_IdAndTo_IdOrderByIdAsc(1L, 1000000000L, paul.getId(), thomas.getId(), thomas.getId(), paul.getId());
            if(!messages.isEmpty()) {
                log.info("Chats already populated, hence skipping chat population");
                return populatedChatsCount;
            }

            ChatMessage msg = new ChatMessage();
            msg.setFrom(paul);
            msg.setTo(thomas);
            msg.setMessage("Hi! Got here via matchmaking");
            chatMessageRepository.save(msg);
            populatedChatsCount++;

            msg = new ChatMessage();
            msg.setFrom(thomas);
            msg.setTo(paul);
            msg.setMessage("Hi! Yep, looks like we're a match");
            chatMessageRepository.save(msg);
            populatedChatsCount++;

            msg = new ChatMessage();
            msg.setFrom(paul);
            msg.setTo(thomas);
            msg.setMessage("Could you teach me Golang?");
            chatMessageRepository.save(msg);
            populatedChatsCount++;

            msg = new ChatMessage();
            msg.setFrom(thomas);
            msg.setTo(paul);
            msg.setMessage("Sure, I use Golang at work. Can you teach me React?");
            chatMessageRepository.save(msg);
            populatedChatsCount++;

            msg = new ChatMessage();
            msg.setFrom(paul);
            msg.setTo(thomas);
            msg.setMessage("Yes, I've been using React for 5 years");
            chatMessageRepository.save(msg);
            populatedChatsCount++;

            msg = new ChatMessage();
            msg.setFrom(thomas);
            msg.setTo(paul);
            msg.setMessage("Great, shall I start a Google Meet?");
            chatMessageRepository.save(msg);
            populatedChatsCount++;

            msg = new ChatMessage();
            msg.setFrom(paul);
            msg.setTo(thomas);
            msg.setMessage("Cool, I'll teach for 30min, then let's switch");
            chatMessageRepository.save(msg);
            populatedChatsCount++;

            msg = new ChatMessage();
            msg.setFrom(thomas);
            msg.setTo(paul);
            msg.setMessage("Let's do it: https://meet.google.com/abc-abcd-abc");
            chatMessageRepository.save(msg);
            populatedChatsCount++;

            return populatedChatsCount;
        } catch(Exception ex) {
            log.error("Failed to populate dummy chats", ex);
            return populatedChatsCount;
        }
    }

    public Map<String, Integer> populate() {
        log.info("Populating skills");
        int populatedSkillsCount = populateSkills();
        log.info("Skill population complete. Populated {} skills", populatedSkillsCount);

        log.info("Populating dummy users");
        int populatedUsersCount = populateUsers();
        log.info("Dummy user population complete. Dummy user count = {}", populatedUsersCount);

        log.info("Populating dummy chats");
        int populatedChatsCount = populateChats();
        log.info("Dummy chats population complete");

        Map<String, Integer> populationResponse = new LinkedHashMap<>();
        populationResponse.put("Populated skills count", populatedSkillsCount);
        populationResponse.put("Populated users count", populatedUsersCount);
        populationResponse.put("Populated chats count", populatedChatsCount);
        return populationResponse;
    }
}
