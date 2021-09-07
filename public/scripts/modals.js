const ModalFunctions = (function () {
    const modalMetaData = {
        currentModalType: undefined,
        currentObject: undefined
    };

    // serializing functions
    const toString = data => `${data}`;
    const toInt = data => parseInt(data);
    const toFloat = data => parseFloat(data);
    const getAddFn = databaseObject => {
        return (databaseName, rawValue, parseFn) => {
            let parsedValue = undefined;
            if (rawValue === undefined || rawValue === null) {
                if (Object.is(parseFn, toString)) {
                    parsedValue = "";
                } else {
                    parsedValue = 0;
                }
            } else {
                parsedValue = parseFn(rawValue);
            }
            if (parsedValue !== modalMetaData.currentObject[databaseName]) databaseObject[databaseName] = parsedValue;
        };
    };

    const modalTypes = {
        customerInfo: {
            modalID: 'customer-modal',
            getPatchURL: () => `/api/customers/customer_id/${modalMetaData.currentObject.customer_id}`,
            load(c) {
                const getElement = elementName => $(`#customer-modal #${elementName}`);
                
                // customer ID
                getElement('customer-id').text(c.customer_id);

                // name
                getElement('first-name').val(c.first_name);
                getElement('middle-name').val(c.middle_name);
                getElement('last-name').val(c.last_name);

                // contact info
                getElement('phone-number').val(c.phone);

                // address
                getElement('house-number').val(c.house_number);
                getElement('street').val(c.street);
                getElement('city').val(c.city);
                getElement('state').val(c.state);
                getElement('country').val(c.country);
                getElement('zip').val(c.zip);

                // notes
                getElement('notes').val(c.customer_notes);
            },
            serialize() {
                const databaseObject = {};
                const from = elementID => $(`#customer-modal #${elementID}`);
                const add = getAddFn(databaseObject);

                add('first_name', from('first-name').val(), toString);
                add('middle_name', from('middle-name').val(), toString);
                add('last_name', from('last-name').val(), toString);
                add('phone', from('phone-number').val(), toString);
                add('house_number', from('house-number').val(), toInt);
                add('street', from('street').val(), toString);
                add('city', from('city').val(), toString);
                add('state', from('state').val(), toString);
                add('country', from('country').val(), toString);
                add('zip', from('zip').val(), toString);
                add('customer_notes', from('notes').val(), toString);

                return databaseObject;
            }
        },

        // [{"order_id":1,"customer_id":5,"status":"Closed","datetime":"2021-07-01T12:00:00.000Z","total_price":"30.99","notes":"","received":2}]
        orderInfo: {
            modalID: 'order-modal',
			getPatchURL: () => `/api/order/order_id/${modalMetaData.currentObject.order_id}`,
            load(o) {
                const getElement = elementName => $(`#order-modal #${elementName}`);
                
                // order ID
                getElement('order-id').text(o.order_id);

                // Properties on o: order_id, customer_id, status, datetime, total_price, notes, received
                getElement('customer-id').text(o.customer_id);
                getElement('date-time').text(`${Utils.formatTime(o.datetime)}, ${Utils.formatDate(o.datetime)}`);
                getElement('total-price').text(o.total_price);
                getElement('status').val(o.status);
                getElement('notes').val(o.notes);
                getElement('received').val(o.received);

                const orderItems = getElement('order-items');
                orderItems.empty();
                $.getJSON(`/api/order_items/order_id/${o.order_id}`, data => {
                    data.forEach(({product_id, product_quantity, price}) => {
                        $.getJSON(`/api/products/product_id/${product_id}`, data => {
                            const { name } = data[0];
                            const newP = $('<p></p>');
                            newP.text(`${name} (${product_quantity} units, $${price})`);
                            orderItems.append(newP);
                        });
                    });
                });
            },
            serialize() {
                const databaseObject = {};
                const from = elementID => $(`#order-modal #${elementID}`);
                const add = getAddFn(databaseObject);

                add('status', from('status').val(), toString);
                add('received', from('received').val(), toInt);
                add('notes', from('notes').val(), toString);
                
                return databaseObject;
            }
        },
         
        productInfo: {
            modalID: 'product-modal',
            getPatchURL: () => `/api/products/product_id/${modalMetaData.currentObject.product_id}`,
            load(p) {
                const getElement = elementName => $(`#product-modal #${elementName}`);
                // Product ID
                getElement('product-id').text(p.product_id);
                getElement('name').text(p.name);
                // Properties on p: product_id, sku, price, name, total_quantity, description
                getElement('sku').text(p.sku);
                getElement('price').text(`$${p.price}`);
                getElement('total-quantity').text(p.total_quantity);
                getElement('description').text(p.description);
            }
        }
    };

    const toggleEditMode = isEditMode => {
        modalMetaData.isInEditMode = isEditMode;
        $('.modal-card-body input, .modal-card-body textarea, .modal-card-body select').prop('disabled', !isEditMode);
        const saveButton = $('.modal-card-foot button.modal-save');
        const editButton = $('.modal-card-foot button.modal-edit');
        if (isEditMode) {
            editButton.hide();
            saveButton.show();
        } else {
            saveButton.hide();
            editButton.show();
        }
    };
 
    const showModal = (modalType, data) => {
        modalMetaData.currentObject = data;
        modalMetaData.currentModalType = modalType;
        modalType.load(data);
        toggleEditMode(false);
        $(`#${modalType.modalID}`).addClass("is-active");
    };

    const sendPatch = () => {
        const requestBody = modalMetaData.currentModalType.serialize();
        if (!$.isEmptyObject(requestBody)) {
            const showConfirmation = elementQuery => {
                const confirmation = $(elementQuery);
                confirmation.show(200, () => {
                    setTimeout(() => {
                        confirmation.hide(200);
                    }, 2000);
                });
                TableFunctions.refreshPage();
            };

            $.ajax({
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                type: 'PATCH',
                url: modalMetaData.currentModalType.getPatchURL(),
                data: JSON.stringify(requestBody),
                processData: false,
                contentType: 'application/json-patch+json',
                complete: function () { console.log("Request complete."); },
                success: function (response, textStatus, jqXhr) {
                    console.log(response, textStatus, jqXhr);
                    showConfirmation('label.modal-saved-confirmation');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR, textStatus, errorThrown);
                    showConfirmation('label.modal-error-on-save');
                }
            });
        }
    };

    return {
        hideModal() {
            $(".modal").removeClass("is-active");
        },
        showCustomerInfoModal(data) {
            showModal(modalTypes.customerInfo, data);
        },
        showOrderInfoModal(data) {
            showModal(modalTypes.orderInfo, data);
        },
        showProductInfoModal(data) {
            showModal(modalTypes.productInfo, data);
        },
        enableEditMode() {
            toggleEditMode(true);
        },
        saveData() {
            toggleEditMode(false);
            sendPatch();
        },
        getCurrentObject() {
            return modalMetaData.currentObject;
        }
    };
})();