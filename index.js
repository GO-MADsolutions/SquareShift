(function () {
  const input = [[3, 2], [4, 3], [2, 3], [3, 4]]
  let planeSeats = [];
  let TOTAL_ASILE_SEATS = 0;
  let TOTAL_WINDOW_SEATS = 0;
  let TOTAL_MIDDLE_SEATS = 0;
  let TOTAL_ASILE_SEATS_ALLOCATED = 0;
  let TOTAL_WINDOW_SEATS_ALLOCATED = 0;
  let TOTAL_MIDDLE_SEATS_ALLOCATED = 0;
  let currentSegment = 0;
  function Seating(type, number) {
    this.type = type;
    this.number = number || null;
  }

  const hasWindowSeats = (index, length) => {
    return index === 0 || index === length - 1
  }

  const hasMiddleSeats = (rows) => {
    return rows > 2;
  }

  const constructAreoplaneSeats = (seats) => {
    for (let i = 0; i < seats.length; i++) {
      const [rows, columns] = seats[i];
      planeSeats[i] = [];
      for (let a = 0; a < rows; a++) {
        planeSeats[i][a] = [];
        for (let b = 0; b < columns; b++) {
          planeSeats[i][a][b] = new Seating("ASILE")
          if (hasWindowSeats(i, seats.length)) {
            if (a === 0 && i === 0) {
              planeSeats[i][a][b] = new Seating("WINDOW")
              TOTAL_WINDOW_SEATS++;
              continue;
            }
            else if (rows - 1 === a && i === seats.length - 1) {
              planeSeats[i][a][b] = new Seating("WINDOW")
              TOTAL_WINDOW_SEATS++;
              continue;
            }
          }

          if (hasMiddleSeats(rows)) {
            if (a !== 0 && a !== rows - 1) {
              planeSeats[i][a][b] = new Seating("MIDDLE")
              TOTAL_MIDDLE_SEATS++;
              continue;
            }
          }
          TOTAL_ASILE_SEATS++;
        }
      }
    }
  }
  const asileSeating = {
    presentRow: 0,
    presentColumn: 0,
    isLeftAllocated: false
  }

  const windowSeating = {
    presentRow: 0,
    presentColumn: 0
  }

  const middleSeating = {
    presentRow: 1,
    presentColumn: 0,
    numberOfMiddleSeatsColumns: 0
  }

  const findNextSegment = (expectedColumn) => {
    for (let i = 0; i < planeSeats.length; i++) {
      const columns = planeSeats[i][0].length;
      if (columns > expectedColumn) {
        currentSegment = i;
        break;
      }
    }
  }
  const allocateInAsile = (ticket) => {
    const rows = planeSeats[currentSegment].length;
    const columns = planeSeats[currentSegment][0].length;
    if (columns <= asileSeating.presentColumn) {
      findNextSegment(asileSeating.presentColumn)
      asileSeating.presentRow = 0;
    }

    if (hasWindowSeats(currentSegment, input.length)) {
      if (currentSegment === 0) {
        planeSeats[currentSegment][rows - 1][asileSeating.presentColumn].number = ticket + 1;
        TOTAL_ASILE_SEATS_ALLOCATED++;
        currentSegment++;
        return;
      }
      else if (currentSegment === planeSeats.length - 1) {
        planeSeats[currentSegment][0][asileSeating.presentColumn].number = ticket + 1;
        TOTAL_ASILE_SEATS_ALLOCATED++;
        asileSeating.presentColumn
        currentSegment = 0;
        asileSeating.presentRow = 0;
        asileSeating.presentColumn = asileSeating.presentColumn + 1;
        return;
      }
    }
    else {
      if (!asileSeating.isLeftAllocated) {
        planeSeats[currentSegment][asileSeating.presentRow][asileSeating.presentColumn].number = ticket + 1;
        asileSeating.presentRow = planeSeats[currentSegment].length - 1;
        TOTAL_ASILE_SEATS_ALLOCATED++;
        asileSeating.isLeftAllocated = true;
        return;
      }
      else {
        planeSeats[currentSegment][asileSeating.presentRow][asileSeating.presentColumn].number = ticket + 1;
        asileSeating.presentRow = 0;
        TOTAL_ASILE_SEATS_ALLOCATED++;
        asileSeating.isLeftAllocated = false;
        currentSegment++;
        asileSeating.presentRow = 0;
        return;
      }
    }
  }

  const allocateInWindow = (ticket) => {
    if (hasWindowSeats(currentSegment, input.length)) {
      const rows = planeSeats[currentSegment].length;
      const columns = planeSeats[currentSegment][0].length;
      if (columns - 1 < windowSeating.presentColumn) {
        currentSegment = planeSeats.length - 1;
      }
      if (currentSegment === 0) {
        planeSeats[currentSegment][0][windowSeating.presentColumn].number = ticket + 1;
        currentSegment = planeSeats.length - 1;
        TOTAL_WINDOW_SEATS_ALLOCATED++;
      }
      else if (currentSegment === planeSeats.length - 1) {
        planeSeats[currentSegment][rows - 1][windowSeating.presentColumn].number = ticket + 1;
        windowSeating.presentColumn++;
        TOTAL_WINDOW_SEATS_ALLOCATED++;
        currentSegment = 0;
      }
    }
    if (TOTAL_WINDOW_SEATS === TOTAL_WINDOW_SEATS_ALLOCATED) {
      currentSegment = 0;
    }
  }
  const findNextCurrentSegmentForMiddle = (segment) => {
    for (let i = 0; i < planeSeats.length; i++) {
      const rows = planeSeats[i].length;
      if(rows > 2 && segment < i) {
        currentSegment =i;
        break;
      }
    }
  }
  const allocateMiddleSeats = (ticket) => {
    if (hasWindowSeats(currentSegment, input.length)) {
      if (currentSegment === 0) {
        middleSeating.numberOfMiddleSeatsColumns = planeSeats[currentSegment].length - 2;
        planeSeats[currentSegment][middleSeating.presentRow][middleSeating.presentColumn].number = ticket + 1;
        currentSegment++;
        middleSeating.presentRow = 1;
      }
      else if (currentSegment === planeSeats.length - 1) {
        middleSeating.numberOfMiddleSeatsColumns = planeSeats[currentSegment].length - 2;
        if (middleSeating.presentRow <= middleSeating.numberOfMiddleSeatsColumns) {
          planeSeats[currentSegment][middleSeating.presentRow][middleSeating.presentColumn].number = ticket + 1;
          middleSeating.presentRow++;
        }
        else {
          planeSeats[currentSegment][middleSeating.presentRow][middleSeating.presentColumn].number = ticket + 1;
          currentSegment = 0;
          middleSeating.presentRow = 1;
        }
      }

    }

    else {
      middleSeating.numberOfMiddleSeatsColumns = planeSeats[currentSegment].length - 2;
      
      if (middleSeating.presentRow <= middleSeating.numberOfMiddleSeatsColumns) {
        planeSeats[currentSegment][middleSeating.presentRow][middleSeating.presentColumn].number = ticket + 1;
        middleSeating.presentRow++;
      }
     
      else {
        findNextCurrentSegmentForMiddle(currentSegment);
        middleSeating.presentRow = 1;
        planeSeats[currentSegment][middleSeating.presentRow][middleSeating.presentColumn].number = ticket + 1;
        currentSegment = 0;
        middleSeating.presentColumn++;   
      }
      
    }
  }
  const allocateSeating = (tickets) => {
    for (let i = 0; i < tickets; i++) {
      if (TOTAL_ASILE_SEATS_ALLOCATED < TOTAL_ASILE_SEATS) {
        allocateInAsile(i);
        continue;
      }
      else if (TOTAL_WINDOW_SEATS > TOTAL_WINDOW_SEATS_ALLOCATED) {
        currentSegment === 0 ? planeSeats.length - 1 : 0;
        allocateInWindow(i);
        continue;
      }
      else {
        allocateMiddleSeats(i);
        continue;
      }


    }
  }

  constructAreoplaneSeats(input);

  allocateSeating(30);

  function printSeatDetails() {
    const allocatedSeating = planeSeats.length;
    const body = document.getElementById("container")
    for (let i = 0; i < allocatedSeating; i++) {
      let row = document.createElement("div");
      row.classList = "seatsContainer";
      const rows = planeSeats[i].length;
      const columns = planeSeats[i][0].length;
      for (let j = 0; j < columns; j++) {
        const seatRow = document.createElement("div");
        seatRow.classList = "seatRow"
        for (let k = 0; k < rows; k++) {
          const seat = document.createElement("div");
          seat.classList = "seat";
          seat.innerText = planeSeats[i][k][j].number;
          if (planeSeats[i][k][j].type === "WINDOW") {
            seat.style.backgroundColor = "green"
          }
          else if (planeSeats[i][k][j].type === "ASILE") {
            seat.style.backgroundColor = "blue"
          } else {
            seat.style.backgroundColor = "red"
          }
          seatRow.appendChild(seat);
        }
        row.appendChild(seatRow);
      }
      body.appendChild(row);
    }
  }
  printSeatDetails();
})();