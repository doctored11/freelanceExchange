const btn = document.querySelector('.btn');
const taskName = document.querySelector('.form__input_large');
const taskDescr = document.querySelector('#descr');
const taskTime = document.querySelector('#timing');
const taskPrice = document.querySelector('#price');
function checkBtn() {
    let name = taskName.value;
    let descr = taskDescr.value;
    let time = taskTime.value;
    let price = taskPrice.value;

    if (name != '' && descr != '' && time != '' && price != '') {
        btn.disabled = false;
        btn.classList.add('active');
    }
    else {
        btn.disabled = true;
        btn.classList.remove('active');
    }
}
let list = [taskName, taskDescr, taskTime, taskPrice]
list.forEach((element) => { element.addEventListener('input', checkBtn) })