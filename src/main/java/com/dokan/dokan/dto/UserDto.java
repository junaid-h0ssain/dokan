package com.dokan.dokan.dto;

import com.dokan.dokan.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    
    private String id;
    private String email;
    private String name;
    
    /**
     * Converts a User entity to UserDto
     * @param user User entity
     * @return UserDto with string ID
     */
    public static UserDto fromUser(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId().toString());
        dto.setEmail(user.getEmail());
        dto.setName(null); // Name field not yet implemented in User entity
        return dto;
    }
}
