//header div
const header = document.createElement("div");
header.setAttribute("id", "header");
const title = document.createElement("h1");
title.innerText = "Pagination";
title.setAttribute("id", "title");
const description = document.createElement("p");
description.innerText = "Pagination task with api data";
description.setAttribute("id", "description");

header.append(title);
header.append(description);

//container div
const container = document.createElement("div");
container.setAttribute("class", "container-fluid");

document.body.append(container);
container.append(header);

//A pageNo element to show the current and Total pages
let pageNo = document.createElement("div");
pageNo.setAttribute("class", "pageNo");
pageNo.innerHTML = `Page <span id="currentPage"></span>/<span id="totalPages"></span>`;

container.appendChild(pageNo);

//table div
const tableDiv = document.createElement("div");
tableDiv.classList.add("table-responsive");

let table = document.createElement("table");
table.classList.add("table", "table-bordered");
table.innerHTML = `<thead>
<tr >
  <th>ID</th>
  <th>NAME</th>
  <th>Email</th>
 </tr>
</thead>
<tbody id="tbody"></tbody>`;

tableDiv.append(table);
container.append(tableDiv);

//nav element for buttons
let ul = document.createElement("ul");
ul.classList.add("pagination", "justify-content-center");

let nav = document.createElement("nav");
nav.setAttribute("arial-label", "Page navigation example");

nav.appendChild(ul);
document.querySelector(".container-fluid").append(nav);

// Fetching the JSON data
var data = async () => {
  await fetch(
    "https://gist.githubusercontent.com/rvsp/add40254aa126f045837fa5b51f47f1f/raw/4d724bfabf4cce7379a386e23bef6576ab99a2f9/pagination.json"
  )
    .then((response) => response.json())
    .then((res) => {
      //default pagination state
      var state = {
        querySet: res,
        page: 1,
        rows: 10,
      };

      document.getElementById("currentPage").innerHTML = state.page;
      document.getElementById("totalPages").innerHTML = state.rows;

      const arr = pagination(state.querySet, state.page, state.rows);

      renderList(arr.querySet);

      renderButtons(arr.pages);

      //nav buttons event
      const buttons = document.querySelectorAll(".page-item");

      for (let button of buttons) {
        button.addEventListener("click", function () {
          let click = button.innerText;

          //nav buttons logic
          click === "First"
            ? (state.page = 1)
            : click === "Last"
            ? (state.page = res.length / 10)
            : click === "Next" && state.page === res.length / 10
            ? (state.page = 1)
            : click === "Next"
            ? (state.page = +state.page + 1)
            : click === "Previous"
            ? (state.page -= 1)
            : (state.page = click);

          click === "Previous" && state.page === 0
            ? (state.page = res.length / 10)
            : "";

          document.getElementById("currentPage").innerHTML = state.page;
          document.getElementById("tbody").innerHTML = null;

          //rendering page according to current page selection
          const arr = pagination(state.querySet, state.page, state.rows);
          renderList(arr.querySet);
        });
      }
    });
};
data();

//function to render row data
const pagination = (querySet, page, rows) => {
  var trimStart = (page - 1) * rows;
  var trimEnd = trimStart + rows;

  var trimmedData = querySet.slice(trimStart, trimEnd);

  var pages = Math.ceil(querySet.length / rows);

  return {
    querySet: trimmedData,
    pages: pages,
  };
};

//function to insert data into table
const renderList = (data) => {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const tr = document.createElement("tr");

    tr.innerHTML = `<td>${data[i].id}</td><td>${data[i].name}</td><td>${data[i].email}</td>`;
    tbody.appendChild(tr);
  }
};

//function to add nav buttons
const renderButtons = (totalPages) => {
  //empty the list elements if already present
  ul.innerHTML = "";

  //firt button
  const first = document.createElement("li");
  first.innerHTML = `<button class="page-link" >First</button>`;
  first.classList.add("page-item");

  ul.prepend(first);

  //next button
  const next = document.createElement("li");
  next.innerHTML = `<button class="page-link" >Next</button>`;
  next.classList.add("page-item");

  ul.append(next);

  //page no buttons
  for (let i = 0; i < totalPages; i++) {
    const anchor = document.createElement("button");
    anchor.classList.add("page-link");
    // anchor.setAttribute("href", "#");

    anchor.innerHTML = i + 1;

    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");

    pageItem.appendChild(anchor);

    ul.appendChild(pageItem);
  }

  //previous button
  const previous = document.createElement("li");
  previous.innerHTML = `<button class="page-link" >Previous</button>`;
  previous.classList.add("page-item");

  ul.append(previous);

  //last button
  const Last = document.createElement("li");
  Last.innerHTML = `<button class="page-link" >Last</button>`;
  Last.classList.add("page-item");

  ul.append(Last);
};
