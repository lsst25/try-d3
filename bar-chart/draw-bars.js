async function drawBars() {
  const dataset = await d3.json("./../my_weather_data.json");

    console.log(dataset[0])

}

drawBars()