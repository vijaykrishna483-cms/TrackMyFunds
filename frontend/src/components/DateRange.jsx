import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDateSevenDaysAgo } from "../libs";

const DateRange = () => {
    const sevenDaysAgo = getDateSevenDaysAgo();

    const [searchParams, setSearchParams] = useSearchParams();

    const [dateFrom, setDateFrom] = useState(() => {
        const df = searchParams.get("df");
        return df && new Date(df).getTime() <= new Date().getTime()
            ? df
            : sevenDaysAgo || new Date().toISOString().split("T")[0];
    });

    const [dateTo, setDateTo] = useState(() => {
        const dt = searchParams.get("dt");
        
        // Create "today + 1 day" in YYYY-MM-DD format
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const defaultDate = tomorrow.toISOString().split("T")[0];
      
        return dt && new Date(dt).getTime() >= new Date(dateFrom).getTime()
          ? dt
          : defaultDate;
      });
      
    useEffect(() => {
        setSearchParams({ df: dateFrom, dt: dateTo });
    }, [dateFrom, dateTo]);
    const handleDateFromChange = (e) => {
        const df = e.target.value;
        setDateFrom(df);
        if (new Date(df).getTime() > new Date(dateTo).getTime()) {
            setDateTo(df);
        }
    };

    const handleDateToChange = (e) => {
        const dt = e.target.value;
        setDateTo(dt);
        if (new Date(dt).getTime() < new Date(dateFrom).getTime()) {
            setDateFrom(dt);
        }
    };

    return (
        <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
                <label
                    className='block text-gray-700 dark:text-gray-400 text-sm mb-2'
                    htmlFor='dateFrom'
                >
                    Filter
                </label>
                <input
                    className='inputStyles'
                    name='dateFrom'
                    type='date'
                    max={dateTo}
                    value={dateFrom}
                    onChange={handleDateFromChange}
                />
            </div>

            <div className='flex items-center gap-1'>
                <label
                    className='block text-gray-700 dark:text-gray-400 text-sm mb-2'
                    htmlFor='dateFrom'
                >
                    To
                </label>

                <input
                    className='inputStyles'
                    name='dateFrom'
                    type={"date"}
                    value={dateTo}
                    min={dateFrom}
                    onChange={handleDateToChange}
                />
            </div>
        </div>
    );
};

export default DateRange;
// export default DateRange;