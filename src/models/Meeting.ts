/**
 * @author Hanzhi Zhou
 * @see [[Meeting]]
 */

/**
 *
 */
import { RawMeeting } from './Meta';
import Section from './Section';

/**
 * A meeting represents a specific meeting time \w information about the instructor and location
 *
 * It has a reference back to the section that it belongs to
 */
export default class Meeting {
    public section: Section;
    public instructor: string;
    public days: string;
    public dates: string;
    public room: string;
    public raw: RawMeeting;
    constructor(section: Section, raw: RawMeeting) {
        this.section = section;
        this.raw = raw;
        this.instructor = raw[0];
        this.days = raw[1];
        this.room = raw[2];
        this.dates = raw[3];
    }

    public sameTimeAs(other: Meeting) {
        return this.days === other.days;
    }
}
