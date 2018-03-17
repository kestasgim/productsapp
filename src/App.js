import React from 'react';
import './App.css';

import {products} from './data.js';
import {orders} from './data.js';
import {categories} from './data.js';

import ReactPaginate from 'react-paginate';

const PERPAGE = 10;
const CURRENCY = "EUR";

const itemsInPage = (items, selectedPage, itemsPerPage) => {
	var start = selectedPage * itemsPerPage;
	var end = start + itemsPerPage;
	end = (end <= items.length ? end : items.length);
	return items.slice(start, end);
}

const initState = (selectedView, items) => {
	var allItems = items;
	return {
		selectedView: selectedView,
		pageCount: Math.ceil(allItems.length/PERPAGE),

		all: allItems,
		filtered: allItems,
		displayed: itemsInPage(allItems, 0, PERPAGE),

		searchString: "",
		activePage: 0,
		filter: ""
	};
}


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = initState("products", products);
	}

	searchItems = (e) => {
		var oldState = this.state;
		oldState.searchString = e.target.value.toLowerCase();
		this.setState(oldState);
		this.updateDisplayedItems();
	}

	handlePageClick = (data) => {
		var selectedPage = data.selected;
		this.showPage(selectedPage);
	}
	
	filterByCategory = (e) => {
		var oldState = this.state;
		oldState.filter = e.target.value.toLowerCase();
		this.setState(oldState);
		this.updateDisplayedItems();
	}
	
	updateDisplayedItems() {

		var str = this.state.searchString;
		var allItems = this.state.all;

		var selectedView = this.state.selectedView; 
		var filteredItems = allItems.filter(
			function(item) {
				var match = (selectedView === "products" ? item.name.toLowerCase() : item.id.toString());
				return match.search(str) !== -1;
			}
		);

		if (selectedView === "products") {
			str = this.state.filter;
			filteredItems = filteredItems.filter(
				function(item) {
					return item.category.toLowerCase().search(str) !== -1;
				}
			);
		}

		var oldState = this.state;
		oldState.filtered = filteredItems;
		oldState.pageCount = Math.ceil(filteredItems.length/PERPAGE);
		this.setState(oldState);

		this.showPage(0);

	}
	
	showPage = (selectedPage) => {
		var displayedItems = itemsInPage(this.state.filtered, selectedPage, PERPAGE);

		var oldState = this.state;
		oldState.displayed = displayedItems;
		oldState.activePage = selectedPage;
		this.setState(oldState);
	}

	switchView = (e) => {
		var selectedView = e.target.value;
		var items = (selectedView === "products" ? products : orders);
		this.setState(initState(selectedView, items));
	}
	
	render() {
		return (
		<div className="page">
			<Navigation selectedView={this.state.selectedView} handler={this.switchView} />
			<Search selectedView={this.state.selectedView} handler={this.searchItems} />

			<div id="pagination-bar">
				<ReactPaginate previousLabel={"<<"}
				nextLabel={">>"}
				breakLabel={<a href="">...</a>}
				breakClassName={"break-me"}
				pageCount={this.state.pageCount}
				forcePage={this.state.activePage}
				marginPagesDisplayed={1}
				pageRangeDisplayed={2}
				onPageChange={this.handlePageClick}
				containerClassName={"pagination"}
				subContainerClassName={"pages pagination"}
				activeClassName={"active"} />
			</div>
				
			{this.state.selectedView === "products" &&
				<Filter categories={categories} handler={this.filterByCategory} />
			}

			{(this.state.selectedView === "products") &&
				<ProductsList items={this.state.displayed} />
			}

			{(this.state.selectedView === "orders") &&
				<OrdersList items={this.state.displayed} />
			}

		</div>
		);
	}
}

const Search = ({selectedView, handler}) =>
	<span>
	{selectedView === "products" &&
		<input type="text" placeholder="Search by name" onChange={handler} />
	}
	{selectedView === "orders" &&
		<input type="text" placeholder="Search by id" onChange={handler} />
	}
	</span>
	

const Navigation = ({selectedView, handler}) => 
	<div>
		{selectedView === "products" &&
			<div><span className="navigation">Products</span><button onClick={handler} value="orders">Show Orders</button></div>
		}
		{selectedView === "orders" &&
			<div><span className="navigation">Orders</span><button onClick={handler} value="products">Show Products</button></div>
		}
	</div>

const Filter = ({categories, handler}) =>
	<div>
		Category: 
		<select onChange={handler}>
			<option value="">All</option>
			{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
		</select>
	</div>

const ProductsList = ({items}) => 
	<div>
		<div className="list-row header">ID, Name, Category, Price ({CURRENCY})</div>
	  	{items.map(item => <div className="list-row" key={item.id}>
		<p>{item.id}, {item.name}, {item.category},  {item.price}</p>
	  	</div>)}
	</div>

const OrdersList = ({items}) => 
	<div>
		<div className="list-row header">ID, Price ({CURRENCY}), Timestamp</div>
	  	{items.map(item => <div className="list-row" key={item.id}>
		<p>{item.id}, {item.price}, {item.time.toString()}</p>
	  	</div>)}
	</div>

export default App;
