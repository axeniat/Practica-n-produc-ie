const clients = [

    {
        id: 1,

        name: "SRL Alfa",

        balance: 10500,

        overdueDays: 75,

        invoices: [

            {
                number: "F-001",

                date: "2026-03-01",

                total: 7000,

                paid: 2000
            },

            {
                number: "F-002",

                date: "2026-03-15",

                total: 5500,

                paid: 0
            }

        ],

        payments: [

            {
                date: "2026-03-10",

                invoice: "F-001",

                amount: 2000
            }

        ]

    },


    {
        id: 2,

        name: "SRL Beta",

        balance: 4500,

        overdueDays: 30,

        invoices: [

            {
                number: "F-003",

                date: "2026-03-10",

                total: 4500,

                paid: 0
            }

        ],

        payments: []

    },


    {
        id: 3,

        name: "SRL Gamma",

        balance: 8300,

        overdueDays: 65,

        invoices: [

            {
                number: "F-004",

                date: "2026-02-20",

                total: 8300,

                paid: 0
            }

        ],

        payments: []

    },


    {
        id: 4,

        name: "SRL Delta",

        balance: 3200,

        overdueDays: 20,

        invoices: [

            {
                number: "F-005",

                date: "2026-03-20",

                total: 3200,

                paid: 0
            }

        ],

        payments: []

    }

];

let selectedClientId = null;

function displayClients() {

    const table =
        document.getElementById("clientTable");


    table.innerHTML = "";


    const sortValue =
        document.getElementById("sortSelect").value;


    let sortedClients = [...clients];


    if (sortValue === "asc") {

        sortedClients.sort(
            (a, b) =>
                a.balance - b.balance
        );

    }


    if (sortValue === "desc") {

        sortedClients.sort(
            (a, b) =>
                b.balance - a.balance
        );

    }

    sortedClients.forEach(client => {

        const row =
            document.createElement("tr");


        if (client.overdueDays > 60) {

            row.classList.add("warning");

        }
        else {

            row.classList.add("success");

        }


        const status =
            client.overdueDays > 60

                ? "Restanță > 60 zile"

                : "În termen";


        row.innerHTML = `

            <td>
                ${client.name}
            </td>

            <td>
                ${client.balance.toFixed(2)}
                lei
            </td>

            <td>
                ${client.overdueDays}
            </td>

            <td>
                ${status}
            </td>

            <td>

                <button
                    class="details-button"
                    onclick="selectClient(${client.id})"
                >

                    Detalii

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}

function selectClient(id) {

    selectedClientId = id;


    const client =
        clients.find(
            client =>
                client.id === id
        );


    if (!client) {

        return;

    }


    displayClientDetails(client);

    displayInvoices(client);

    displayPayments(client);

    document
        .getElementById("clientDetails")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}

function displayClientDetails(client) {

    const details =
        document.getElementById("clientDetails");


    details.innerHTML = `

        <div class="client-info">


            <div class="info-box">

                <strong>
                    Client:
                </strong>

                <p>
                    ${client.name}
                </p>

            </div>


            <div class="info-box">

                <strong>
                    Sold:
                </strong>

                <p>
                    ${client.balance.toFixed(2)}
                    lei
                </p>

            </div>


            <div class="info-box">

                <strong>
                    Zile de restanță:
                </strong>

                <p>
                    ${client.overdueDays}
                    zile
                </p>

            </div>


        </div>

    `;

}

function displayInvoices(client) {

    const table =
        document.getElementById("invoiceTable");


    table.innerHTML = "";


    let unpaidInvoices = 0;


    client.invoices.forEach(invoice => {

        const remaining =
            invoice.total - invoice.paid;

        if (remaining <= 0) {

            return;

        }


        unpaidInvoices++;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${invoice.number}
            </td>

            <td>
                ${invoice.date}
            </td>

            <td>
                ${invoice.total.toFixed(2)}
                lei
            </td>

            <td>
                ${invoice.paid.toFixed(2)}
                lei
            </td>

            <td>
                ${remaining.toFixed(2)}
                lei
            </td>

            <td>

                <input

                    type="number"

                    class="invoice-payment"

                    data-invoice="${invoice.number}"

                    data-remaining="${remaining}"

                    min="0"

                    max="${remaining}"

                    step="0.01"

                    placeholder="0.00"

                >

            </td>

        `;


        table.appendChild(row);

    });

    if (unpaidInvoices === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6">

                    Nu există facturi neachitate.

                </td>

            </tr>

        `;

    }

}

function displayPayments(client) {

    const table =
        document.getElementById("paymentTable");


    table.innerHTML = "";


    if (client.payments.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="3">

                    Nu există plăți înregistrate.

                </td>

            </tr>

        `;

        return;

    }


    client.payments.forEach(payment => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${payment.date}
            </td>

            <td>
                ${payment.invoice}
            </td>

            <td>
                ${payment.amount.toFixed(2)}
                lei
            </td>

        `;


        table.appendChild(row);

    });

}

function showMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "paymentMessage"
        );


    element.textContent = message;


    element.className = "";


    if (type === "success") {

        element.classList.add(
            "message-success"
        );

    }


    if (type === "error") {

        element.classList.add(
            "message-error"
        );

    }

}

function registerPayment() {

    if (selectedClientId === null) {

        showMessage(
            "Selectați mai întâi un client.",
            "error"
        );

        return;

    }

    const paymentInput =
        document.getElementById(
            "paymentAmount"
        );


    const totalPayment =
        Number(paymentInput.value);

    if (
        !Number.isFinite(totalPayment) ||
        totalPayment <= 0
    ) {

        showMessage(
            "Introduceți o sumă mai mare decât 0.",
            "error"
        );

        return;

    }

    const client =
        clients.find(
            client =>
                client.id === selectedClientId
        );


    if (!client) {

        return;

    }

    if (
        totalPayment >
        client.balance
    ) {

        showMessage(
            "Suma introdusă este mai mare decât soldul clientului.",
            "error"
        );

        return;

    }


    const inputs =
        document.querySelectorAll(
            ".invoice-payment"
        );


    if (inputs.length === 0) {

        showMessage(
            "Clientul nu are facturi neachitate.",
            "error"
        );

        return;

    }


    let allocatedTotal = 0;


    let allocationError = false;


    const allocations = [];

    inputs.forEach(input => {


        const amount =
            Number(input.value) || 0;


        if (amount < 0) {

            allocationError = true;

            return;

        }


        if (amount === 0) {

            return;

        }


        const invoiceNumber =
            input.dataset.invoice;


        const remaining =
            Number(
                input.dataset.remaining
            );


        if (
            amount >
            remaining
        ) {

            allocationError = true;

            return;

        }


        allocatedTotal += amount;


        allocations.push({

            invoiceNumber:
                invoiceNumber,

            amount:
                amount

        });

    });

    if (allocationError) {

        showMessage(
            "Suma alocată unei facturi nu poate depăși restul acesteia.",
            "error"
        );

        return;

    }

    if (allocations.length === 0) {

        showMessage(
            "Introduceți suma care trebuie alocată pe cel puțin o factură.",
            "error"
        );

        return;

    }

    if (
        Math.abs(
            allocatedTotal -
            totalPayment
        ) > 0.001
    ) {

        showMessage(
            "Suma repartizată pe facturi trebuie să fie egală cu suma totală a plății.",
            "error"
        );

        return;

    }

    allocations.forEach(
        allocation => {


            const invoice =
                client.invoices.find(
                    invoice =>
                        invoice.number ===
                        allocation.invoiceNumber
                );


            if (!invoice) {

                return;

            }


            invoice.paid +=
                allocation.amount;


            client.payments.push({

                date:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                invoice:
                    invoice.number,

                amount:
                    allocation.amount

            });

        }
    );

    client.balance -=
        totalPayment;

    client.balance =
        Number(
            client.balance.toFixed(2)
        );

    displayClients();

    displayClientDetails(client);

    displayInvoices(client);

    displayPayments(client);

    paymentInput.value = "";

    showMessage(
        "Plata a fost înregistrată și repartizată cu succes.",
        "success"
    );

}

document
    .getElementById("sortSelect")
    .addEventListener(
        "change",
        displayClients
    );

document
    .getElementById("paymentButton")
    .addEventListener(
        "click",
        registerPayment
    );

displayClients();