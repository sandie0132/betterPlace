export const TimeFilterConfig = {
    timeFilters: {
        options: [
            { key: "allTime", option: "all_time", optionLabel: "all time" },
            { key: "lastDay", option: "last_day", optionLabel: "last day" },
            { key: "lastWeek", option: "last_week", optionLabel: "last week" },
            { key: "lastMonth", option: "last_month", optionLabel: "last month" },
            { key: "lastYear", option: "last_year", optionLabel: "last year" },
            { key: "customDateRange", option: { "from": null , "to": null }, optionLabel: "custom date range" }
        ]
    }

}