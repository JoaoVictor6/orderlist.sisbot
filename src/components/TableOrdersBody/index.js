import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faEye, faTrash} from '@fortawesome/free-solid-svg-icons';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {TableCell, TableRow} from './styles';
import {OrderListContext} from '../../contexts/OrderListContext';
import ModalConfirmDialog from '../ModalConfirmDialog';
import Clickable from '../Clickable';
import Utils from '../../Utils';
import ButtonDeleteSelectedItems from '../ButtonDeleteSelectedItems';

const TableOrdersBody = () => {
  const {
    orderListItems,
    setOrderListItems,
    setPaidOrderItems,
    Translator,
    screenshotMode,
    dashboardData,
    setEditMode,
    setModalClothesOpened,
    settings,
    showBudget,
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

    // COLLECT SELECTED ROWS TO FURTHER DELETION
    const selectedRowsID = [];
    updatedOrderListItems.forEach((orderItem) => {
      if (orderItem.payment.paid) selectedRowsID.push(orderItem.id);
    });

    setPaidOrderItems(selectedRowsID);
    setOrderListItems(updatedOrderListItems);
  };

  const handleDelete = (itemID, confirmed = false) => {
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
    setEditMode({
      enabled: true,
      orderItem,
    });

    setModalClothesOpened(true);
  };

  const getCustomTShirtName = (gender) => (gender === 'FEMALE' ? '-BL' : '');

  const handleOnDragEnd = ({source, destination}) => {
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (sourceIndex === destinationIndex) return;

    const listToHandle = [...orderListItems];
    const sourceItem = listToHandle[sourceIndex];
    const destinationItem = listToHandle[destinationIndex];

    // replace element positions
    listToHandle[destinationIndex] = sourceItem;
    listToHandle[sourceIndex] = destinationItem;

    setOrderListItems(listToHandle); // update context
  };

  return (
    <>
      {/* CONFIRM DELETE ITEM FROM LIST */}
      <ModalConfirmDialog
        isOpen={confirmDeleteItem.isOpen}
        title={Translator('MAIN_TITLE')}
        textContent={Translator('CONFIRM_DELETE_ITEM_MODAL')}
        handleConfirm={() => handleDelete(confirmDeleteItem.itemID, true)}
        handleClose={handleCloseDeleteDialog}
      />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="droppable-1">
          {(provided) => (
            <tbody
              id="tableOrderListItems"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {orderListItems.length > 0 ? (
                // RENDER ALL ITES
                orderListItems.map((item, index) => (
                  <Draggable
                    draggableId={`${item.id}`}
                    index={index}
                    key={item.id}>
                    {(draggableProvided, snapshot) => (
                      <TableRow
                        isDragging={snapshot.isDragging}
                        key={item.id}
                        className={item.payment.paid && 'paid'}
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}>
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
                              : `${clothe.quantity}${getCustomTShirtName(
                                  clothe.gender,
                                )}-${Translator(clothe.size)}`}
                          </TableCell>
                        ))}

                        {/* PAYMENT VALUE */}
                        <TableCell
                          style={!showBudget ? {filter: 'blur(4px)'} : {}}>
                          {showBudget
                            ? `${
                                settings.coinPrefix
                              } ${item.payment.value.toFixed(2)}`
                            : '***'}
                        </TableCell>

                        {/* EYE ICON */}
                        <TableCell className="d-table-cell d-md-none">
                          <Clickable handleClick={() => handleEdit(item)}>
                            <FontAwesomeIcon icon={faEye} />
                          </Clickable>
                        </TableCell>

                        {/* EDIT ICON */}
                        <TableCell
                          className={
                            screenshotMode ? 'd-none' : 'd-none d-md-table-cell'
                          }>
                          <Clickable handleClick={() => handleEdit(item)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </Clickable>
                        </TableCell>

                        {/* TRASH ICON */}
                        <TableCell
                          className={
                            screenshotMode ? 'd-none' : 'd-none d-md-table-cell'
                          }>
                          <Clickable
                            handleClick={() => handleDelete(item.id)}
                            className="color-flat-red">
                            <FontAwesomeIcon icon={faTrash} />
                          </Clickable>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))
              ) : (
                // EMPTY LIST
                <TableRow>
                  <TableCell
                    colSpan={Utils.GetTotalColumnsTableOrderListItems(
                      document.getElementById('tableOrderListItems'),
                    )}>
                    {Translator('LIST_EMPTY')}
                  </TableCell>
                </TableRow>
              )}

              {provided.placeholder}
            </tbody>
          )}
        </Droppable>
      </DragDropContext>

      <tfoot>
        <ButtonDeleteSelectedItems />

        <tr className={!screenshotMode ? 'd-none' : ''}>
          <td colSpan={10} className="text-right">
            <strong>{Translator('FINAL_VALUE')}</strong>
          </td>
          <td className="text-center">
            <strong>
              {showBudget
                ? `${settings.coinPrefix} ${dashboardData.totalToReceive}`
                : '***'}
            </strong>
          </td>
        </tr>
      </tfoot>
    </>
  );
};

export default TableOrdersBody;
