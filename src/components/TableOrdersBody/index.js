import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faEye, faTrash} from '@fortawesome/free-solid-svg-icons';
import {TableCell, TableRow} from './styles';
import {OrderListContext} from '../../contexts/OrderListContext';
import ModalConfirmDialog from '../ModalConfirmDialog';
import Utils from '../../Utils';

const TableOrdersBody = () => {
  const {
    orderListItems,
    setOrderListItems,
    Translator,
    screenshotMode,
    dashboardData,
    setEditMode,
    setModalClothesOpened,
    setTempOrderItem,
    initialTempOrderItem,
  } = useContext(OrderListContext);

  const [confirmDeleteItem, setConfirmDeleteItem] = useState({});

  const isEmptyClothe = (clothe) =>
    clothe.size === '' || clothe.quantity === '';

  const handleChange = (e, itemID) => {
    // ATUALIZAR O STATUS DO PAGAMENTO DO USUÁRIO PELO id
    const {checked} = e.target;
    const updatedOrderListItems = orderListItems.map((orderItem) => {
      if (orderItem.id === itemID) {
        // UPDATE PAYMENT
        return {
          ...orderItem,
          payment: {
            ...orderItem.payment,
            paid: checked,
          },
        };
      }
      return orderItem;
    });

    setOrderListItems(updatedOrderListItems);
  };

  const handleDelete = (itemID, confirmed = false) => {
    console.log('confirmed', confirmed);
    if (!confirmed) {
      setConfirmDeleteItem({
        isOpen: true,
        itemID,
      });

      return;
    }

    // USER CONFIRMED! DELETE
    const updatedOrderListItems = orderListItems.filter(
      (orderItem) => orderItem.id !== itemID,
    );

    setOrderListItems(updatedOrderListItems);

    setConfirmDeleteItem({
      isOpen: false,
      itemID: null,
    });
  };

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteItem({
      ...confirmDeleteItem,
      isOpen: false,
    });
  };

  const handleEdit = (orderItem) => {
    console.log('Editing: ', orderItem);

    setEditMode({
      enabled: true,
      orderItem,
    });

    setModalClothesOpened(true);
  };

  return (
    <>
      {/* CONFIRM DELETE ITEM FROM LIST */}
      <ModalConfirmDialog
        isOpen={confirmDeleteItem.isOpen}
        title="Lista de Pedidos"
        textContent="Deseja mesmo excluir o item selecionado?"
        handleConfirm={() => handleDelete(confirmDeleteItem.itemID, true)}
        handleClose={handleCloseDeleteDialog}
      />

      <tbody id="tableOrderListItems">
        {orderListItems.length > 0 ? (
          orderListItems.map((item) => (
            <TableRow key={item.id} className={item.payment.paid && 'paid'}>
              {/* PAID */}
              <TableCell>
                <input
                  type="checkbox"
                  checked={item.payment.paid}
                  onChange={(e) => handleChange(e, item.id)}
                />
              </TableCell>

              {/* NAME */}
              <TableCell className="text-left">{item.name}</TableCell>

              {/* NUMBER */}
              <TableCell>{item.number}</TableCell>

              {/* CLOTHES COLUMNS */}
              {item.clothingSettings.map((clothe) => (
                <TableCell
                  key={clothe.id}
                  className={`${
                    !screenshotMode ? 'd-none d-md-table-cell' : ''
                  }`}>
                  {isEmptyClothe(clothe)
                    ? '-'
                    : `${clothe.quantity}-${Translator(clothe.size)}`}
                </TableCell>
              ))}

              {/* PAYMENT VALUE */}
              <TableCell>$ {item.payment.value}</TableCell>

              {/* EYE ICON */}
              <TableCell className="d-table-cell d-md-none">
                <a href="#!" onClick={() => handleEdit(item)}>
                  <FontAwesomeIcon icon={faEye} />
                </a>
              </TableCell>

              {/* EDIT ICON */}
              <TableCell
                className={
                  screenshotMode ? 'd-none' : 'd-none d-md-table-cell'
                }>
                <a href="#!" onClick={() => handleEdit(item)}>
                  <FontAwesomeIcon icon={faEdit} />
                </a>
              </TableCell>

              {/* TRASH ICON */}
              <TableCell
                className={
                  screenshotMode ? 'd-none' : 'd-none d-md-table-cell'
                }>
                <a
                  href="#!"
                  className="color-flat-red"
                  onClick={() => handleDelete(item.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </a>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={Utils.GetTotalColumnsTableOrderListItems(
                document.getElementById('tableOrderListItems'),
              )}>
              Nenhum item até o momento.
            </TableCell>
          </TableRow>
        )}
      </tbody>

      <tfoot className={!screenshotMode ? 'd-none' : ''}>
        <tr>
          <td colSpan={9} className="text-right">
            <strong>Valor Final</strong>
          </td>
          <td className="text-center">
            <strong>$ {dashboardData.totalToReceive}</strong>
          </td>
        </tr>
      </tfoot>
    </>
  );
};

export default TableOrdersBody;
