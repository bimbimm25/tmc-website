export interface Menu {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string | null;
    image: string | null;
    is_bestseller: boolean;
    is_recommended: boolean;
}

export interface Event {
    id: number;
    type: 'event_workshop' | 'birthday_package';
    title: string;
    description: string | null;
    location_name: string;
    price: number;
    capacity: number | null;
    event_date: string | null;
    image: string | null;
    is_active: boolean;
}

export interface RobloxMission {
    id: number;
    title: string;
    description: string | null;
    reward_title: string;
    reward_code: string | null;
    roblox_map_link: string | null;
    trailer_video_url: string | null;
    image: string | null;
    is_active: boolean;
}

export interface HomeDataResponse {
    status: string;
    message: string;
    data: {
        highlight_menus: Menu[];
        latest_event: Event | null;
        active_mission: RobloxMission | null;
    };
}