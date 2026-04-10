import api from './api';

export interface UpdateUserDto {
  email: string;
  name: string;
  profilePhoto?: File;
}

export interface ProfilePreferences {
  hidden_project_names: string[];
  project_order: string[];
  hidden_skill_names: string[];
  hidden_app_names: string[];
  hidden_language_names: string[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
  profilePhoto?: string | null;
  isVerified: boolean;
  role: string;
  activity_sync_at: string;
  createdAt: string;
  updatedAt: string;
  timezone_offset: number;
  description?: string;
  github_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  profile_preferences?: ProfilePreferences;
}

export interface PatchProfilePayload {
  name?: string;
  description?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  profile_preferences?: Partial<ProfilePreferences>;
  /** Clears stored profile photo (use when user removes picture without uploading a new one). */
  remove_profile_photo?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

type UserApiPayload = User & { profile_photo?: string | null };

function normalizeUser(d: UserApiPayload): User {
  return {
    ...d,
    profilePhoto: d.profilePhoto ?? d.profile_photo ?? null,
  };
}

export const userService = {
  /**
   * Get current user profile
   * @returns User profile from backend
   */
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<UserApiPayload>>("/user/me");
    return normalizeUser(response.data.data);
  },

  /**
   * Create user profile on first login
   * Note: This endpoint creates a profile only and cannot be used to update an existing profile.
   * If the user already exists, a 409 Conflict error will be returned.
   * isVerified is automatically handled by the backend based on Firebase email verification status.
   * @param data - User data to create profile (email, name, optional profilePhoto)
   * @returns Created user profile
   * @throws Error with 409 status if user already exists
   */
  async createProfile(data: UpdateUserDto): Promise<User> {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('name', data.name);

    if (data.profilePhoto) {
      formData.append('profilePhoto', data.profilePhoto);
    }

    const response = await api.put<ApiResponse<User>>('/user/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return normalizeUser(response.data.data as UserApiPayload);
  },

  /**
   * Sync or create user profile (for OAuth providers)
   * Creates a new profile on first login or returns existing user data
   * isVerified is automatically handled by the backend based on Firebase email verification status.
   * @param data - User data (email, name, optional profilePhoto)
   * @returns User profile (created or existing)
   */
  async syncOrCreateProfile(data: UpdateUserDto): Promise<User> {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('name', data.name);

    if (data.profilePhoto) {
      formData.append('profilePhoto', data.profilePhoto);
    }

    const response = await api.put<ApiResponse<User>>('/user/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return normalizeUser(response.data.data as UserApiPayload);
  },

  async patchProfile(data: PatchProfilePayload): Promise<User> {
    const response = await api.patch<ApiResponse<UserApiPayload>>("/user/me", data);
    return normalizeUser(response.data.data);
  },

  async updateProfilePhoto(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("profilePhoto", file);
    const response = await api.post<ApiResponse<UserApiPayload>>("/user/me/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeUser(response.data.data);
  },
};
