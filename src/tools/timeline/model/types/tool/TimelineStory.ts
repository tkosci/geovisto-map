export type TimelineStoryConfig = {
    name: string;
    config: StorySnapshot[]
}

export type StorySnapshot = {
    time: number,
    zoom: number,
    latitude: number,
    longitude: number,
    stepTimeLength?: number,
    flyToDuration?: number,
    transitionDelay?: number,
    transitionDuration?: number,
}
