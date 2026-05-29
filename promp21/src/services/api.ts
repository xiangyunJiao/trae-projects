const API_BASE_URL = 'http://localhost:3001/api';

export interface UserPointsResponse {
  success: boolean;
  data?: {
    userId: string;
    points: number;
    lastUpdated: string;
  };
  error?: string;
}

export interface LocationData {
  id: number;
  name: string;
  points: number;
}

export interface LocationsResponse {
  success: boolean;
  data: LocationData[];
}

export interface RewardData {
  id: string;
  name: string;
}

export interface RewardsResponse {
  success: boolean;
  data: RewardData[];
}

export const fetchUserPoints = async (userId: string = 'user_001'): Promise<UserPointsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/points?userId=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user points:', error);
    return {
      success: false,
      error: 'Network error'
    };
  }
};

export const updateUserPoints = async (userId: string, points: number): Promise<UserPointsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, points }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update user points:', error);
    return {
      success: false,
      error: 'Network error'
    };
  }
};

export const fetchLocations = async (): Promise<LocationsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return {
      success: false,
      data: []
    };
  }
};

export const fetchRewards = async (): Promise<RewardsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rewards`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch rewards:', error);
    return {
      success: false,
      data: []
    };
  }
};
