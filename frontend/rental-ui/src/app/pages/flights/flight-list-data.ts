export const flightData = {
  search_metadata: {
    id: '68165784dafde17964047038',
    status: 'Success',
    json_endpoint:
      'https://serpapi.com/searches/24b89f29ededf9af/68165784dafde17964047038.json',
    created_at: '2025-05-03 17:51:00 UTC',
    processed_at: '2025-05-03 17:51:00 UTC',
    google_flights_url:
      'https://www.google.com/travel/flights?hl=en&gl=us&curr=USD&tfs=CBwQAhoeEgoyMDI1LTA1LTEwagcIARIDQlVEcgcIARIDWVhVGh4SCjIwMjUtMDUtMjBqBwgBEgNZWFVyBwgBEgNCVURCAwEBAkgBcAGYAQE&tfu=EgIIAQ',
    raw_html_file:
      'https://serpapi.com/searches/24b89f29ededf9af/68165784dafde17964047038.html',
    prettify_html_file:
      'https://serpapi.com/searches/24b89f29ededf9af/68165784dafde17964047038.prettify',
    total_time_taken: 46.71,
  },
  search_parameters: {
    engine: 'google_flights',
    hl: 'en',
    gl: 'us',
    type: '1',
    departure_id: 'BUD',
    arrival_id: 'YXU',
    outbound_date: '2025-05-10',
    return_date: '2025-05-20',
    adults: 2,
    children: 1,
    currency: 'USD',
  },
  other_flights: [
    {
      flights: [
        {
          departure_airport: {
            name: 'Budapest Ferenc Liszt International Airport',
            id: 'BUD',
            time: '2025-05-10 06:00',
          },
          arrival_airport: {
            name: 'Frankfurt Airport',
            id: 'FRA',
            time: '2025-05-10 07:50',
          },
          duration: 110,
          airplane: 'Airbus A320',
          airline: 'Lufthansa',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/LH.png',
          travel_class: 'Economy',
          flight_number: 'LH 1343',
          ticket_also_sold_by: ['Air Canada'],
          legroom: '30 in',
          extensions: [
            'Average legroom (30 in)',
            'Carbon emissions estimate: 260 kg',
          ],
        },
        {
          departure_airport: {
            name: 'Frankfurt Airport',
            id: 'FRA',
            time: '2025-05-10 10:00',
          },
          arrival_airport: {
            name: 'Toronto Pearson International Airport',
            id: 'YYZ',
            time: '2025-05-10 12:40',
          },
          duration: 520,
          airplane: 'Airbus A330',
          airline: 'Air Canada',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/AC.png',
          travel_class: 'Economy',
          flight_number: 'AC 841',
          ticket_also_sold_by: ['Lufthansa'],
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'Wi-Fi for a fee',
            'In-seat power & USB outlets',
            'On-demand video',
            'Carbon emissions estimate: 1059 kg',
          ],
        },
        {
          departure_airport: {
            name: 'Toronto Pearson International Airport',
            id: 'YYZ',
            time: '2025-05-10 14:15',
          },
          arrival_airport: {
            name: 'London International Airport',
            id: 'YXU',
            time: '2025-05-10 15:04',
          },
          duration: 49,
          airplane: 'Canadair RJ 900',
          airline: 'Air Canada',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/AC.png',
          travel_class: 'Economy',
          flight_number: 'AC 8257',
          ticket_also_sold_by: ['Lufthansa'],
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'In-seat USB outlet',
            'Stream media to your device',
            'Carbon emissions estimate: 143 kg',
          ],
          plane_and_crew_by: 'Air Canada Express - Jazz',
        },
      ],
      layovers: [
        {
          duration: 130,
          name: 'Frankfurt Airport',
          id: 'FRA',
        },
        {
          duration: 95,
          name: 'Toronto Pearson International Airport',
          id: 'YYZ',
        },
      ],
      total_duration: 904,
      carbon_emissions: {
        this_flight: 1463000,
        typical_for_this_route: 1646000,
        difference_percent: -11,
      },
      price: 2271,
      type: 'Round trip',
      airline_logo:
        'https://www.gstatic.com/flights/airline_logos/70px/multi.png',
      departure_token:
        'WyJDalJJUXpRd04yWnZjV28yTmxWQlJXUnJRM2RDUnkwdExTMHRMUzB0TFMxNWJHSnFOa0ZCUVVGQlIyZFhWalpqUTBvNFFVMUJFaE5NU0RFek5ETjhRVU00TkRGOFFVTTRNalUzR2dzSWlPNE5FQUlhQTFWVFJEZ2NjSWp1RFE9PSIsW1siQlVEIiwiMjAyNS0wNS0xMCIsIkZSQSIsbnVsbCwiTEgiLCIxMzQzIl0sWyJGUkEiLCIyMDI1LTA1LTEwIiwiWVlaIixudWxsLCJBQyIsIjg0MSJdLFsiWVlaIiwiMjAyNS0wNS0xMCIsIllYVSIsbnVsbCwiQUMiLCI4MjU3Il1dXQ==',
    },
    {
      flights: [
        {
          departure_airport: {
            name: 'Budapest Ferenc Liszt International Airport',
            id: 'BUD',
            time: '2025-05-10 13:25',
          },
          arrival_airport: {
            name: 'Munich International Airport',
            id: 'MUC',
            time: '2025-05-10 14:45',
          },
          duration: 80,
          airplane: 'Airbus A320',
          airline: 'Lufthansa',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/LH.png',
          travel_class: 'Economy',
          flight_number: 'LH 1677',
          ticket_also_sold_by: ['Air Canada'],
          legroom: '30 in',
          extensions: [
            'Average legroom (30 in)',
            'Carbon emissions estimate: 201 kg',
          ],
        },
        {
          departure_airport: {
            name: 'Munich International Airport',
            id: 'MUC',
            time: '2025-05-10 15:55',
          },
          arrival_airport: {
            name: 'Toronto Pearson International Airport',
            id: 'YYZ',
            time: '2025-05-10 18:30',
          },
          duration: 515,
          airplane: 'Airbus A350',
          airline: 'Lufthansa',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/LH.png',
          travel_class: 'Economy',
          flight_number: 'LH 494',
          ticket_also_sold_by: ['Air Canada'],
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'In-seat USB outlet',
            'On-demand video',
            'Carbon emissions estimate: 1228 kg',
          ],
        },
        {
          departure_airport: {
            name: 'Toronto Pearson International Airport',
            id: 'YYZ',
            time: '2025-05-10 20:40',
          },
          arrival_airport: {
            name: 'London International Airport',
            id: 'YXU',
            time: '2025-05-10 21:29',
          },
          duration: 49,
          airplane: 'Canadair RJ 900',
          airline: 'Air Canada',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/AC.png',
          travel_class: 'Economy',
          flight_number: 'AC 8263',
          ticket_also_sold_by: ['Lufthansa'],
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'In-seat USB outlet',
            'Stream media to your device',
            'Carbon emissions estimate: 143 kg',
          ],
          often_delayed_by_over_30_min: true,
          plane_and_crew_by: 'Air Canada Express - Jazz',
        },
      ],
      layovers: [
        {
          duration: 70,
          name: 'Munich International Airport',
          id: 'MUC',
        },
        {
          duration: 130,
          name: 'Toronto Pearson International Airport',
          id: 'YYZ',
        },
      ],
      total_duration: 844,
      carbon_emissions: {
        this_flight: 1573000,
        typical_for_this_route: 1646000,
        difference_percent: -4,
      },
      price: 2309,
      type: 'Round trip',
      airline_logo:
        'https://www.gstatic.com/flights/airline_logos/70px/multi.png',
      departure_token:
        'WyJDalJJUXpRd04yWnZjV28yTmxWQlJXUnJRM2RDUnkwdExTMHRMUzB0TFMxNWJHSnFOa0ZCUVVGQlIyZFhWalpqUTBvNFFVMUJFaE5NU0RFMk56ZDhURWcwT1RSOFFVTTRNall6R2dzSXg0c09FQUlhQTFWVFJEZ2NjTWVMRGc9PSIsW1siQlVEIiwiMjAyNS0wNS0xMCIsIk1VQyIsbnVsbCwiTEgiLCIxNjc3Il0sWyJNVUMiLCIyMDI1LTA1LTEwIiwiWVlaIixudWxsLCJMSCIsIjQ5NCJdLFsiWVlaIiwiMjAyNS0wNS0xMCIsIllYVSIsbnVsbCwiQUMiLCI4MjYzIl1dXQ==',
    },
    {
      flights: [
        {
          departure_airport: {
            name: 'Budapest Ferenc Liszt International Airport',
            id: 'BUD',
            time: '2025-05-10 09:30',
          },
          arrival_airport: {
            name: 'Zurich Airport',
            id: 'ZRH',
            time: '2025-05-10 11:10',
          },
          duration: 100,
          airplane: 'Airbus A320neo',
          airline: 'SWISS',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/LX.png',
          travel_class: 'Economy',
          flight_number: 'LX 2251',
          ticket_also_sold_by: ['Air Canada'],
          legroom: '29 in',
          extensions: [
            'Below average legroom (29 in)',
            'Carbon emissions estimate: 219 kg',
          ],
        },
        {
          departure_airport: {
            name: 'Zurich Airport',
            id: 'ZRH',
            time: '2025-05-10 13:25',
          },
          arrival_airport: {
            name: 'Toronto Pearson International Airport',
            id: 'YYZ',
            time: '2025-05-10 16:25',
          },
          duration: 540,
          airplane: 'Boeing 777',
          airline: 'Air Canada',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/AC.png',
          travel_class: 'Economy',
          flight_number: 'AC 881',
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'Wi-Fi for a fee',
            'In-seat power & USB outlets',
            'On-demand video',
            'Carbon emissions estimate: 1203 kg',
          ],
        },
        {
          departure_airport: {
            name: 'Toronto Pearson International Airport',
            id: 'YYZ',
            time: '2025-05-10 20:40',
          },
          arrival_airport: {
            name: 'London International Airport',
            id: 'YXU',
            time: '2025-05-10 21:29',
          },
          duration: 49,
          airplane: 'Canadair RJ 900',
          airline: 'Air Canada',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/AC.png',
          travel_class: 'Economy',
          flight_number: 'AC 8263',
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'In-seat USB outlet',
            'Stream media to your device',
            'Carbon emissions estimate: 143 kg',
          ],
          often_delayed_by_over_30_min: true,
          plane_and_crew_by: 'Air Canada Express - Jazz',
        },
      ],
      layovers: [
        {
          duration: 135,
          name: 'Zurich Airport',
          id: 'ZRH',
        },
        {
          duration: 255,
          name: 'Toronto Pearson International Airport',
          id: 'YYZ',
        },
      ],
      total_duration: 1079,
      carbon_emissions: {
        this_flight: 1566000,
        typical_for_this_route: 1646000,
        difference_percent: -5,
      },
      price: 2439,
      type: 'Round trip',
      airline_logo:
        'https://www.gstatic.com/flights/airline_logos/70px/multi.png',
      departure_token:
        'WyJDalJJUXpRd04yWnZjV28yTmxWQlJXUnJRM2RDUnkwdExTMHRMUzB0TFMxNWJHSnFOa0ZCUVVGQlIyZFhWalpqUTBvNFFVMUJFaE5NV0RJeU5URjhRVU00T0RGOFFVTTRNall6R2dzSWtmRU9FQUlhQTFWVFJEZ2NjSkh4RGc9PSIsW1siQlVEIiwiMjAyNS0wNS0xMCIsIlpSSCIsbnVsbCwiTFgiLCIyMjUxIl0sWyJaUkgiLCIyMDI1LTA1LTEwIiwiWVlaIixudWxsLCJBQyIsIjg4MSJdLFsiWVlaIiwiMjAyNS0wNS0xMCIsIllYVSIsbnVsbCwiQUMiLCI4MjYzIl1dXQ==',
    },
    {
      flights: [
        {
          departure_airport: {
            name: 'Budapest Ferenc Liszt International Airport',
            id: 'BUD',
            time: '2025-05-10 08:25',
          },
          arrival_airport: {
            name: 'Munich International Airport',
            id: 'MUC',
            time: '2025-05-10 09:55',
          },
          duration: 90,
          airplane: 'Airbus A220-300 Passenger',
          airline: 'Lufthansa',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/LH.png',
          travel_class: 'Economy',
          flight_number: 'LH 1675',
          ticket_also_sold_by: ['United'],
          legroom: '30 in',
          extensions: [
            'Average legroom (30 in)',
            'Carbon emissions estimate: 225 kg',
          ],
          plane_and_crew_by: 'Air Baltic',
        },
        {
          departure_airport: {
            name: 'Munich International Airport',
            id: 'MUC',
            time: '2025-05-10 12:00',
          },
          arrival_airport: {
            name: 'Dulles International Airport',
            id: 'IAD',
            time: '2025-05-10 15:00',
          },
          duration: 540,
          airplane: 'Boeing 787',
          airline: 'United',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/UA.png',
          travel_class: 'Economy',
          flight_number: 'UA 109',
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'Wi-Fi for a fee',
            'In-seat power & USB outlets',
            'On-demand video',
            'Carbon emissions estimate: 1219 kg',
          ],
        },
        {
          departure_airport: {
            name: 'Dulles International Airport',
            id: 'IAD',
            time: '2025-05-10 17:20',
          },
          arrival_airport: {
            name: 'Toronto Pearson International Airport',
            id: 'YYZ',
            time: '2025-05-10 19:05',
          },
          duration: 105,
          airplane: 'Embraer 175',
          airline: 'United',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/UA.png',
          travel_class: 'Economy',
          flight_number: 'UA 3453',
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'Wi-Fi for a fee',
            'Stream media to your device',
            'Carbon emissions estimate: 263 kg',
          ],
          plane_and_crew_by: 'Republic Airways DBA United Express',
        },
        {
          departure_airport: {
            name: 'Toronto Pearson International Airport',
            id: 'YYZ',
            time: '2025-05-10 20:40',
          },
          arrival_airport: {
            name: 'London International Airport',
            id: 'YXU',
            time: '2025-05-10 21:29',
          },
          duration: 49,
          airplane: 'Canadair RJ 900',
          airline: 'Air Canada',
          airline_logo:
            'https://www.gstatic.com/flights/airline_logos/70px/AC.png',
          travel_class: 'Economy',
          flight_number: 'AC 8263',
          ticket_also_sold_by: ['United'],
          legroom: '31 in',
          extensions: [
            'Average legroom (31 in)',
            'In-seat USB outlet',
            'Stream media to your device',
            'Carbon emissions estimate: 143 kg',
          ],
          often_delayed_by_over_30_min: true,
          plane_and_crew_by: 'Air Canada Express - Jazz',
        },
      ],
      layovers: [
        {
          duration: 125,
          name: 'Munich International Airport',
          id: 'MUC',
        },
        {
          duration: 140,
          name: 'Dulles International Airport',
          id: 'IAD',
        },
        {
          duration: 95,
          name: 'Toronto Pearson International Airport',
          id: 'YYZ',
        },
      ],
      total_duration: 1144,
      carbon_emissions: {
        this_flight: 1853000,
        typical_for_this_route: 1646000,
        difference_percent: 13,
      },
      price: 4542,
      type: 'Round trip',
      airline_logo:
        'https://www.gstatic.com/flights/airline_logos/70px/multi.png',
      departure_token:
        'WyJDalJJUXpRd04yWnZjV28yTmxWQlJXUnJRM2RDUnkwdExTMHRMUzB0TFMxNWJHSnFOa0ZCUVVGQlIyZFhWalpqUTBvNFFVMUJFaHBNU0RFMk56VjhWVUV4TURsOFZVRXpORFV6ZkVGRE9ESTJNeG9MQ0pEY0d4QUNHZ05WVTBRNEhIQ1EzQnM9IixbWyJCVUQiLCIyMDI1LTA1LTEwIiwiTVVDIixudWxsLCJMSCIsIjE2NzUiXSxbIk1VQyIsIjIwMjUtMDUtMTAiLCJJQUQiLG51bGwsIlVBIiwiMTA5Il0sWyJJQUQiLCIyMDI1LTA1LTEwIiwiWVlaIixudWxsLCJVQSIsIjM0NTMiXSxbIllZWiIsIjIwMjUtMDUtMTAiLCJZWFUiLG51bGwsIkFDIiwiODI2MyJdXV0=',
    },
  ],
  price_insights: {
    lowest_price: 2271,
    price_level: 'low',
    typical_price_range: [2700, 3600],
  },
  airports: [
    {
      departure: [
        {
          airport: {
            id: 'BUD',
            name: 'Budapest Ferenc Liszt International Airport',
          },
          city: 'Budapest',
          country: 'Hungary',
          country_code: 'HU',
          image:
            'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQP77q3BrVyZRN5ZSUF9U5C6fVVdi5Xrj1rUre1GQGm-lDVvm7MYIkI2sXsr9H9jTZgRkRmDNOuqpmTGQ',
          thumbnail:
            'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ3WwpxSKJb8lt8hmVeWh1QcK2TMUszzvy7-Z8bkLbNVOpleeOYPOt92plDtuKijWfGRKUT5f2R5kmWqeqP6GIqsV2kvpyLtd1NGYXQF4c',
        },
      ],
      arrival: [
        {
          airport: {
            id: 'YXU',
            name: 'London International Airport',
          },
          city: 'London',
          country: 'Canada',
          country_code: 'CA',
          image:
            'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS9x1_Mt-IpdUW_yxdlnZ4VzGov4h7AuS3Zt1Ma9K22V_8L0LVFGqU4PXp9fnV3fJbAqRNudO2kdjsO1A',
          thumbnail:
            'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRR2Nvgrq0q74ZDe2tesaWOVZIk1xmf26KjIJQvC_hvqvIxuVKh_KUvIuMu4QejeAEXsvgoXTZTY49F3_7UPPQGbdZYhGkjTrIEzxWOOU0',
        },
      ],
    },
    {
      departure: [
        {
          airport: {
            id: 'YXU',
            name: 'London International Airport',
          },
          city: 'London',
          country: 'Canada',
          country_code: 'CA',
          image:
            'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcS9x1_Mt-IpdUW_yxdlnZ4VzGov4h7AuS3Zt1Ma9K22V_8L0LVFGqU4PXp9fnV3fJbAqRNudO2kdjsO1A',
          thumbnail:
            'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRR2Nvgrq0q74ZDe2tesaWOVZIk1xmf26KjIJQvC_hvqvIxuVKh_KUvIuMu4QejeAEXsvgoXTZTY49F3_7UPPQGbdZYhGkjTrIEzxWOOU0',
        },
      ],
      arrival: [
        {
          airport: {
            id: 'BUD',
            name: 'Budapest Ferenc Liszt International Airport',
          },
          city: 'Budapest',
          country: 'Hungary',
          country_code: 'HU',
          image:
            'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQP77q3BrVyZRN5ZSUF9U5C6fVVdi5Xrj1rUre1GQGm-lDVvm7MYIkI2sXsr9H9jTZgRkRmDNOuqpmTGQ',
          thumbnail:
            'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ3WwpxSKJb8lt8hmVeWh1QcK2TMUszzvy7-Z8bkLbNVOpleeOYPOt92plDtuKijWfGRKUT5f2R5kmWqeqP6GIqsV2kvpyLtd1NGYXQF4c',
        },
      ],
    },
  ],
};
