const TableFunctions = (function () {
    const allTableData = {
        customers: {
            endpoint: 'customers',
            specificItemEndpoint: 'customer_id',
            buttonID: 'customers-button',
            searchField: 'names',
            offset: 0,
            cache: null,
            idSearchCache: null,
            showModalFn: ModalFunctions.showCustomerInfoModal,
            schema: [
                ["ID", c => c.customer_id],
                ["Name", c => Utils.truncate(`${c.last_name}, ${c.first_name}`, 30)],
                ["Notes", c => c.customer_notes ? Utils.truncate(c.customer_notes, 90) : ""]
            ]
        },
        products: {
            endpoint: 'products',
            specificItemEndpoint: 'product_id',
            buttonID: 'products-button',
            searchField: 'products',
            offset: 0,
            cache: null,
            idSearchCache: null,
            showModalFn: ModalFunctions.showProductInfoModal,
            schema: [
                ["ID", p => p.product_id],
                ["SKU", p => p.sku],
                ["Name", p => Utils.truncate(p.name, 50)],
                ["Price", p => `$${p.price}`],
                ["Quantity", p => p.total_quantity],
                ["Description", p => Utils.truncate(p.description, 50)],
            ]
        },
        orders: {
            endpoint: 'order',
            specificItemEndpoint: 'order_id',
            buttonID: 'orders-button',
            searchField: 'orders',
            offset: 0,
            cache: null,
            idSearchCache: null,
            showModalFn: ModalFunctions.showOrderInfoModal,
            schema: [
                ["ID", o => o.order_id],
                ["Status", o => o.status],
                ["Date", o => Utils.formatDate(o.datetime)],
                ["Time", o => Utils.formatTime(o.datetime)],
                ["Price", o => `$${o.total_price}`],
                ["Notes", o => o.notes],
                ["Received", o => o.received ? "Yes" : "No"]
            ]
        }
    };

    const tableMetaData = {
        limit: 50,
        currentTable: allTableData.customers
    };

    const updatePagination = () => {
        const currentPage = tableMetaData.currentTable.offset / tableMetaData.limit + 1;
        $.getJSON(`/api/${tableMetaData.currentTable.endpoint}/count`, data => {
            const totalPages = Math.floor(data / tableMetaData.limit) + (data % tableMetaData.limit === 0 ? 0 : 1);

            // updating prev/next buttons
            $("button.pagination-previous").prop("disabled", currentPage === 1);
            $("button.pagination-next").prop("disabled", currentPage === totalPages);

            // updating pagination bubbles
            const paginationList = $('ul.pagination-list');
            paginationList.empty();
            const addEllipses = () => { paginationList.append($('<li><span class="pagination-ellipsis">&hellip;</span></li>')); };
            const addLink = (pageNum) => {
                if (pageNum === currentPage) {
                    paginationList.append($(`<li><button class="pagination-link is-current">${pageNum}</button></li>`));
                } else {
                    paginationList.append($(`<li><button class="pagination-link" onclick="TableFunctions.goToPage(${pageNum})">${pageNum}</button></li>`));
                }
            };

            if (totalPages < 5) {
                for (let pageNum = 1; pageNum <= totalPages; pageNum++) addLink(pageNum);
            } else {
                let pageNums = undefined;

                if (currentPage <= 2) {
                    pageNums = [1, 2, 3, 4, totalPages];
                } else if (currentPage >= totalPages - 1) {
                    pageNums = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                } else {
                    pageNums = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
                }

                pageNums.forEach((value, index) => {
                    if (index > 0 && (Math.abs(value - pageNums[index - 1] !== 1))) addEllipses();
                    addLink(value);
                });
            }
        });
    };

    const showModal = (data) => {
        tableMetaData.currentTable.showModalFn(data);
    };

    function updateTable(tableData, data) {
        if (tableData.cache !== data) tableData.cache = data;
        if (!Array.isArray(data) || data.length === 0) {
            $('p#no-data-error').show();
            data = [];
        } else {
            $('p#no-data-error').hide();
        }

        const columns = tableData.schema;
        const columnNames = columns.map(column => column[0]);
        const columnSchemas = columns.map(column => column[1]);
    
        const newCell = cellContent => $("<td></td>").text(cellContent);
        const newRow = cellData => $("<tr></tr>").append(cellData.map(newCell));
    
        // updating head
        const tableHead = $(`#listview-thead`);
        tableHead.empty();
        tableHead.append(newRow(columnNames));
    
        // updating body
        const tableBody = $(`#listview-tbody`);
        tableBody.empty();
        data.forEach(row => {
            const tr = newRow(columnSchemas.map(schema => schema(row)));
            tr.click(() => { showModal(row); });
            tableBody.append(tr);
        });

        updatePagination();
        $('#searchArea .table-specific').css('display', 'none');
        $(`#${tableMetaData.currentTable.searchField}`).css('display', 'flex');
    }
    
    const getUri = tableData => `/api/${tableData.endpoint}?limit=${tableMetaData.limit}&offset=${tableData.offset}`;

    const getSpecificItemUri = (tableData, id) => `/api/${tableData.endpoint}/${tableData.specificItemEndpoint}/${id}`;

    const refreshCurrentTable = () => {
        const tableData = tableMetaData.currentTable;
        $.getJSON(getUri(tableData), data => { updateTable(tableData, data); });
    };

    const switchTablesWithNewData = (tableData, newData) => {
        tableMetaData.currentTable = tableData;
        updateTable(tableData, newData);
    };

    const switchTables = tableData => {
        tableMetaData.currentTable = tableData;
        if (tableData.cache) {
            updateTable(tableData, tableData.cache);
        } else {
            refreshCurrentTable();
        }
        $('#idSearch').val(tableData.idSearchCache);
    };

    const getNameSearchParams = (firstName, lastName) => {
        if (firstName) {
            if (lastName) {
                return `first_name=${firstName}&last_name=${lastName}`
            } else {
                return `first_name=${firstName}`
            }
        } else if (lastName) {
            return `last_name=${lastName}`
        }
        return null;
    };

    const filterByName = (firstName, lastName) => {
        const nameSearchParams = getNameSearchParams(firstName, lastName);
        if (nameSearchParams) {
            tableMetaData.currentTable.offset = 0;
            const searchUri = `${getUri(tableMetaData.currentTable)}&${nameSearchParams}`;
            $.getJSON(searchUri, data => { updateTable(tableMetaData.currentTable, data); });
        } else {
            refreshCurrentTable();
        }
    };

    return {
        goToPage(pageNum) {
            tableMetaData.currentTable.offset = (pageNum - 1) * tableMetaData.limit;
            refreshCurrentTable();
        },
        next() {
            tableData = tableMetaData.currentTable;
            tableData.offset += tableMetaData.limit;
            refreshCurrentTable();
        },
        prev() {
            tableData = tableMetaData.currentTable;
            if (tableData.offset !== 0) {
                tableData.offset -= tableMetaData.limit;
                refreshCurrentTable();
            }
        },
        populateCustomers() {
            switchTables(allTableData.customers);
        },
        populateProducts() {
            switchTables(allTableData.products);
        },
        populateOrders() {
            switchTables(allTableData.orders);
        },
        refreshPage() {
            refreshCurrentTable();
        },
        searchByName() {
            const firstName = $('#fnameSearch').val();
            const lastName = $('#lnameSearch').val();
            filterByName(firstName, lastName);
        },
        searchByID() {
            const itemID = $('#idSearch').val();
            tableMetaData.currentTable.idSearchCache = itemID;
            if (!itemID) {
                return;
            }
            try {
                $.getJSON(getSpecificItemUri(tableMetaData.currentTable, itemID), data => {
                    updateTable(tableMetaData.currentTable, data);
                }).fail(() => {
                    updateTable(tableMetaData.currentTable, []);
                });
            } catch (error) {
                console.log(error);
                updateTable(tableMetaData.currentTable, []);
            }
        },
        showCustomerOrders() {
            // filter customers by name
            const { first_name, last_name, customer_id } = ModalFunctions.getCurrentObject();
            $('#fnameSearch').val(first_name);
            $('#lnameSearch').val(last_name);
            $('input#orderSearch').val(customer_id);
            allTableData.customers.offset = 0;
            $.getJSON(`${getUri(allTableData.customers)}&${getNameSearchParams(first_name, last_name)}`, data => {
                updateTable(allTableData.customers, data);

                // switch to and filter orders
                switchTables(allTableData.orders);
                $.getJSON(`/api/order/customer_id/${customer_id}`, data => {
                    switchTablesWithNewData(allTableData.orders, data);
                }).fail(() => {
                    switchTablesWithNewData(allTableData.orders, []);
                }).always(() => {
                    $(`#${allTableData.customers.buttonID}`).removeClass("active").prop('disabled', false);
                    $(`#${allTableData.orders.buttonID}`).addClass("active").prop('disabled', true);
                    ModalFunctions.hideModal();
                });
            });
        },
        searchOrdersByCustomerID() {
            const customer_id = $('input#orderSearch').val();
            if (customer_id === "") {
                refreshCurrentTable();
            } else {
                allTableData.orders.offset = 0;
                $.getJSON(`/api/order/customer_id/${customer_id}`, data => {
                    switchTablesWithNewData(allTableData.orders, data);
                });
            }
        },
        addNewItem() {
            console.log("Add new item called");
        },
        clearAllFields() {
            $("#searchArea input").val("");
            allTableData.customers.cache = null;
            allTableData.orders.cache = null;
            allTableData.products.cache = null;
            allTableData.customers.idSearchCache = null;
            allTableData.orders.idSearchCache = null;
            allTableData.products.idSearchCache = null;
            refreshCurrentTable();
        }
    }
})();

TableFunctions.populateCustomers();
