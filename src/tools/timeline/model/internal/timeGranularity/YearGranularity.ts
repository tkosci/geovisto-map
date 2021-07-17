import { eachYearOfInterval } from 'date-fns';

// Geovisto core
import { MapDomain } from "../../../../..";

import { ITimeGranularity } from "../../types/timeGranularity/ITimeGranularity";
import { TimeGranularity } from "../constants";

/**
 * This class provides time interval granularity.
 * 
 * @author Krystof Rykala
 */
export class YearGranularity extends MapDomain implements ITimeGranularity {

    /**
     * It initializes the granularity.
     */
    public constructor() {
        super(YearGranularity.TYPE());
    }

    /**
     * Type of the granularity.
     */
    public static TYPE(): string {
        return TimeGranularity.YEAR;
    }
 
    /**
     * It returns each year of interval with given granularity.
     * 
     * @param start
     * @param end 
     */
    public getTimesWithinInterval(start: Date, end: Date): Date[] {
        const interval = eachYearOfInterval({ start, end });
        return interval;
    }
}
