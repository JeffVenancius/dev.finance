const get_desc = document.querySelector('#description');
const get_amount = document.querySelector('#amount');
const get_date = document.querySelector('#date');

let isVisible = true;
let transactions_array = [];


function format_currency(value){
	let operator = value < 0 ? "- " : "";
	value = format_number(value)/100
	value = value.toLocaleString('pt-br',{ style:"currency", currency: "BRL"});
	return operator + value;
}

function format_number(value){
	value = String(value).replace(/\D/g,"");
	return Number(value);

}


class Transaction{
	constructor(description, value, date){
		this.description = description;
		this.value = format_number(value);
		this.date = date;
	}

	type(){
		let desc_class = `#${this.description}927`; // description should be unique - will be easier to find and less confusing.
		if (this.value < 0){
			document.querySelector(desc_class).classList.add('active'); // red (!important - I know I've shouldn't, but I think it's justified (less code and very explicit)).
		}
		else{
			document.querySelector(desc_class).classList.remove('active'); // green.
		}
	}


	create_item(){ // the addition of '927' is so the user won't mess up the classes/ids by mistake.
		const item_html = `
			<td class="${this.description}927">${this.description}</td>
			<td id="${this.description}927"class="${this.description}927">${format_currency(this.value)}</td>
			<td class="${this.description}927">${this.date}</td>
			<td class="${this.description}927"><button class="minus927" onclick=remove_item('${this.description}')><img src="assets/minus.svg" alt=""></button></td>`;

		let tr = document.createElement('tr');
		tr.innerHTML = item_html;
		document.querySelector('#data-table tbody').appendChild(tr);
	}


}

load()
function remove_item(item){
	for (i = 0; i < transactions_array.length; i++){
		if (transactions_array[i].description === item){
			transactions_array.splice(i,1);
			save()
			break;
		}
	}
	updateSums();
	document.querySelectorAll(`.${item}927`).forEach( i => i.remove());
	
}

function add_transaction(description, value, date){
	let _transaction = new Transaction(description, value, date);
	_transaction.create_item();
	_transaction.type();
	transactions_array.push(_transaction);
	save();
	updateSums();
}

function is_valid(desc, amount, date){
	let descCount = 0
	transactions_array.forEach(i => {
		if (i.description === desc){
		descCount += 1}
	})
	if (descCount > 0 || amount == 0 || !/\d{2}-\d{2}-\d{2,}/g.test(date)){
		return false
	}
	else{return true}
}

function submit_transaction(event){
	event.preventDefault();
	if (is_valid(get_desc.value, get_amount.value, get_date.value)){
		add_transaction(get_desc.value, format_currency(get_amount.value), format_date(get_date.value));
		modal();
	}
}

function clear_fields(){
	get_desc.value = "";
	get_amount.value = "";
	get_date.value = "";
	}

function modal(){
	isVisible = !isVisible;
	if (!isVisible) {
		document.querySelector('.modal-overlay').classList.add('active');
	} 
	else{
		document.querySelector('.modal-overlay').classList.remove('active');
		clear_fields();
	}
}

function format_date(date){
	let arrDate = date.split('-');
	return arrDate[1]+'/'+arrDate[2] + '/' + arrDate[0];
}

function updateSums(){
	document.getElementById('income').innerHTML = format_currency(inSum());
	document.getElementById('expense').innerHTML = format_currency(outSum());
	document.getElementById('total').innerHTML = format_currency(totalSum());
}

function totalSum() {
	return inSum() + outSum();
}

function outSum() {
	let sum = 0;
	transactions_array.forEach(i => {if (i.value < 0){sum += i.value;}})
	return sum
}


function inSum() {
	let sum = 0;
	transactions_array.forEach(i => {if (i.value > 0){sum += i.value;}})
	return sum
}


function save(){
	localStorage.setItem('dev.finances:transactionsArray', JSON.stringify(transactions_array))
}

function load(){
	let data = JSON.parse(localStorage.getItem('dev.finances:transactionsArray'));
	data.forEach(i =>{
		add_transaction(i.description, i.value, i.date)
	})
}

