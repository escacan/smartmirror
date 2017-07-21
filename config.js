/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

/*
*		hong hong hong
*
*/

var config = {
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses.

	language: "ko_KR",
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "캘린더",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar-check-o ",
						url: "webcal://calendar.google.com/calendar/ical/shinhybi%40gmail.com/private-64fa82b06c771c6c605fa706387c1b31/basic.ics"
					}
				]
			}
		},
		{
			module: "compliments",
			position: "lower_third"
		},
		{
			module: "currentweather",
			position: "top_right",
			config: {
				location: "Seoul",
				locationID: "1835848",  //ID from http://www.openweathermap.org/help/city_list.txt
				appid: "f785a8931e180fb4110bd6006b2411f5"
			}
		},
		{
			module: "weatherforecast",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				location: "Seoul",
				locationID: "1835848",  //ID from http://www.openweathermap.org/help/city_list.txt
				appid: "f785a8931e180fb4110bd6006b2411f5"
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "실시간 뉴스속보",
						url: "http://media.daum.net/rss/today/primary/all/rss2.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true
			}
		},
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
