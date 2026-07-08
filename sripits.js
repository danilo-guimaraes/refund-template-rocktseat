
const form = document.querySelector('form');
const amount = document.querySelector('#amount');
const expense = document.querySelector('#expense');
const category = document.querySelector('#category');
const expenseList = document.querySelector('ul')
const expenseQuantity = document.querySelector('aside header p span');
const expenseTotal = document.querySelector('aside header h2');
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, '')

    value = Number(value) / 100
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
    })
    return value
}


form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        create_at: new Date(),
    }

    expsenseAdd(newExpense)
}

function expsenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement('li')
        expenseItem.classList.add('expense')

        const expsenseIcon = document.createElement('img')
        expsenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
        expsenseIcon.setAttribute('alt', newExpense.category_name)

        const expenseInfo = document.createElement('div')
        expenseInfo.classList.add('expense-info')

        const expenseName = document.createElement('strong')
        expenseName.textContent = newExpense.expense

        const expenseCategory = document.createElement('span')
        expenseCategory.textContent = newExpense.category_name

        expenseInfo.append(expenseName, expenseCategory)

        const expenseAmount = document.createElement('span')
        expenseAmount.classList.add('expense-amount')

        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace('R$', '')}`

        const removeIcon = document.createElement('img')
        removeIcon.classList.add('remove-icon')
        removeIcon.setAttribute('src', 'img/remove.svg')
        removeIcon.setAttribute('alt', 'remover')

        expenseItem.append(expsenseIcon, expenseInfo, expenseAmount, removeIcon)

        expenseList.append(expenseItem)
        formClear()
        updateTotals()

    } catch (error) {
        alert('nao foi possivel atualizar a lista de despesas')
        console.log(error)
    }
}

function updateTotals() {
    try {
        const items = expenseList.children

        expenseQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`

        let total = 0
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector('.expense-amount')

            let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.')

            value = parseFloat(value)

            if (isNaN(value)) {
                return alert('Nao foi possivel calcular o total, o valor nao parece um numero.')
            }

            total += Number(value)
        }

        const symbolBRL = document.createElement('small')
        symbolBRL.textContent = 'R$'

        total = formatCurrencyBRL(total).toUpperCase().replace('R$', '')
        expenseTotal.innerHTML = ''

        expenseTotal.append(symbolBRL,total)


    } catch (error) {
        console.log(error);

        alert('Nao foi possivel atualizar os totais')
    }
}

expenseList.addEventListener('click', (event) => {

    if (event.target.classList.contains('remove-icon')) {

        const item = event.target.closest('.expense')

        item.remove()
    }

    updateTotals()
})

function formClear() {
    expense.value = ''
    category.value = ''
    amount.value = ''
    
    expense.focus()

}
