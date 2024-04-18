import moment from 'moment';
import { promises as fs } from 'fs';

//Reading File

const readAvailabilityData = async () => {
    const data = await fs.readFile('./src/availability.json', 'utf8');
    return JSON.parse(data);
};

// Function for handle Next Available Slot

const findNextAvailableSlot = async (res, currentDate, currentTime) => {
    const date = moment(currentDate);
    let checkedDays = 0;

    const availabilityData = await readAvailabilityData();
    const timings = availabilityData.availabilityTimings;

    while (checkedDays < 7) {
        const dayOfWeek = date.format('dddd').toLowerCase();
        const slots = timings[dayOfWeek];

        if (slots && slots.length > 0) {
            if (date.format('YYYY-MM-DD') === currentDate && slots[0].start <= currentTime) {
                date.add(1, 'days');
            } else {
                return res.send({
                    "isAvailable": false,
                    "nextAvailableSlot": {
                        "date": date.format('YYYY-MM-DD'),
                        "time": slots[0].start
                    }
                });
            }
        } else {
            date.add(1, 'days');
        }

        checkedDays++;
    }
    return res.status(404).send({ error: "No available slots found within a week." });
}



// handling controller

const AppointmentController = {

    getDetails: async (req, res) => {
        const { date, time } = req.query;
    
        if (!date || !time) {
            return res.status(400).send({ error: "Date and time must be provided" });
        }

        const availabilityData = await readAvailabilityData();
        const timings = availabilityData.availabilityTimings;
        const dayOfWeek = moment(date).format('dddd').toLowerCase();
        const availableTimes = timings[dayOfWeek];
    
        if (!availableTimes || availableTimes.length === 0) {
            return findNextAvailableSlot(res, date, time);
        }
    
        for (const slot of availableTimes) {
            if (time >= slot.start && time <= slot.end) {
                return res.send({ "isAvailable": true });
            }
        }
    
        return findNextAvailableSlot(res, date, time);
    }
    
}
    


export default AppointmentController;