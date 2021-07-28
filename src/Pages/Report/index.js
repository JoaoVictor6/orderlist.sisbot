import React, {useContext, useEffect, useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
import 'moment/min/locales';
import {OrderListContext} from '../../contexts/OrderListContext';

import TableContentCentered from '../../components/TableContentCentered';
import {AnnotationContainer} from '../../components/AnnotationsBox/styles';
import PenField from '../../components/PenField';
import ReportHeader from '../../components/ReportHeader';
import ReportMenu from '../../components/ReportMenu';

const Report = () => {
  const {
    orderListItems,
    orderListItemsNotes,
    clothingIcons,
    clothingSizes,
    Translator,
  } = useContext(OrderListContext);

  const [sortedOrderList, setSortedOrderList] = useState({
    male: {
      tshirt: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      tshirtLong: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      shorts: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      pants: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      tanktop: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      vest: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
    },
    female: {
      tshirt: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      tshirtLong: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      shorts: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      pants: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      tanktop: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
      vest: {
        'T-PP': 0,
        'T-P': 0,
        'T-M': 0,
        'T-G': 0,
        'T-XG': 0,
        'T-GG': 0,
        'T-2XG': 0,
        'T-3XG': 0,
        'T-4XG': 0,
      },
    },
    childish: {
      tshirt: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      tshirtLong: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      shorts: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      pants: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      tanktop: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
      vest: {
        'T-2A': 0,
        'T-4A': 0,
        'T-6A': 0,
        'T-8A': 0,
        'T-10A': 0,
        'T-12A': 0,
        'T-14A': 0,
        'T-16A': 0,
      },
    },
  });

  const isEmptyClothingSettings = (clothingSettings) => {
    let totalPieces = 0;
    Object.keys(clothingSettings).map((key) => {
      totalPieces += clothingSettings[key];
      return key;
    });

    return totalPieces === 0;
  };

  const isEmptyClothingWithSize = (sortedItems, sizeToCheck) => {
    let totalPieces = 0;

    Object.keys(sortedItems).map((clotheName) => {
      Object.keys(sortedItems[clotheName]).map((innerKey) => {
        if (innerKey === sizeToCheck) {
          totalPieces += sortedItems[clotheName][innerKey];
        }
        return innerKey;
      });
      return clotheName;
    });

    return totalPieces === 0;
  };

  // TRANSLATE MOMENTJS FORMAT
  moment.locale(Translator('MOMENTJS'));

  // CALCULATE DATA DO FILL TABLES
  useEffect(() => {
    orderListItems.map((orderItem) => {
      // PROCESS THE CLOTHES
      orderItem.clothingSettings.map((theClothe) => {
        if (theClothe.quantity > 0 && theClothe.size !== '') {
          const tempSortedOrderList = {...sortedOrderList};
          tempSortedOrderList[orderItem.gender.toLowerCase()][theClothe.name][
            theClothe.size
          ] += theClothe.quantity;

          setSortedOrderList(tempSortedOrderList);
        }
        return theClothe;
      });
      return orderItem;
    });
  }, [orderListItems]);

  return (
    <div>
      <Row>
        <Col>
          <ReportMenu />
        </Col>
      </Row>

      <div id="report" style={{padding: '0px 10px'}}>
        <Row className="mt-5">
          {/* LEFT SIDE */}
          <Col xs="6">
            <ReportHeader
              title="SISBot"
              subtitle={Translator('PROCESSING_REPORT_TITLE')}
              date={moment().format('LLL')}
            />
          </Col>

          {/* RIGHT SIDE */}
          <Col xs="6">
            <PenField label={Translator('CLIENT')} />
            <PenField label={Translator('REQUEST_DATE')} />
            <PenField label={Translator('DELIVERY_DATE')} />
            <PenField label={Translator('REPONSIBLE')} />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col xs="6">
            <h5>{Translator('MALE').toUpperCase()}</h5>
            <TableContentCentered>
              <thead>
                <tr>
                  <th>-</th>
                  {clothingIcons.map((clothingIcon) => (
                    <th
                      key={clothingIcon.id}
                      className={
                        isEmptyClothingSettings(
                          sortedOrderList.male[clothingIcon.name],
                        )
                          ? 'd-none'
                          : ''
                      }>
                      <img src={clothingIcon.icon} alt="clothing" height={25} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...clothingSizes].map((size) => (
                  <tr
                    key={size.id}
                    className={
                      isEmptyClothingWithSize(sortedOrderList.male, size.code)
                        ? 'd-none'
                        : ''
                    }>
                    <td>{Translator(size.code)}</td>
                    {clothingIcons.map((clothingIcon) => {
                      const settings = sortedOrderList.male[clothingIcon.name];
                      const quantityForTheSize = settings[size.code];

                      return (
                        <td
                          key={clothingIcon.id}
                          className={
                            isEmptyClothingSettings(settings) ? 'd-none' : ''
                          }>
                          {quantityForTheSize > 0 ? quantityForTheSize : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </TableContentCentered>
          </Col>

          <Col xs="6">
            <h5>{Translator('FEMALE').toUpperCase()}</h5>
            <TableContentCentered>
              <thead>
                <tr>
                  <th>-</th>
                  {clothingIcons.map((clothingIcon) => (
                    <th
                      key={clothingIcon.id}
                      className={
                        isEmptyClothingSettings(
                          sortedOrderList.female[clothingIcon.name],
                        )
                          ? 'd-none'
                          : ''
                      }>
                      <img src={clothingIcon.icon} alt="clothing" height={25} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...clothingSizes].map((size) => (
                  <tr
                    key={size.id}
                    className={
                      isEmptyClothingWithSize(sortedOrderList.female, size.code)
                        ? 'd-none'
                        : ''
                    }>
                    <td>{Translator(size.code)}</td>
                    {clothingIcons.map((clothingIcon) => {
                      const settings =
                        sortedOrderList.female[clothingIcon.name];
                      const quantityForTheSize = settings[size.code];

                      return (
                        <td
                          key={clothingIcon.id}
                          className={
                            isEmptyClothingSettings(settings) ? 'd-none' : ''
                          }>
                          {quantityForTheSize > 0 ? quantityForTheSize : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </TableContentCentered>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs="6">
            <h5>{Translator('CHILDISH').toUpperCase()}</h5>
            <TableContentCentered>
              <thead>
                <tr>
                  <th>-</th>
                  {clothingIcons.map((clothingIcon) => (
                    <th
                      key={clothingIcon.id}
                      className={
                        isEmptyClothingSettings(
                          sortedOrderList.childish[clothingIcon.name],
                        )
                          ? 'd-none'
                          : ''
                      }>
                      <img src={clothingIcon.icon} alt="clothing" height={25} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...clothingSizes].map((size) => (
                  <tr
                    key={size.id}
                    className={
                      isEmptyClothingWithSize(
                        sortedOrderList.childish,
                        size.code,
                      )
                        ? 'd-none'
                        : ''
                    }>
                    <td>{Translator(size.code)}</td>
                    {clothingIcons.map((clothingIcon) => {
                      const settings =
                        sortedOrderList.childish[clothingIcon.name];
                      const quantityForTheSize = settings[size.code];

                      return (
                        <td
                          key={clothingIcon.id}
                          className={
                            isEmptyClothingSettings(settings) ? 'd-none' : ''
                          }>
                          {quantityForTheSize > 0 ? quantityForTheSize : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </TableContentCentered>
          </Col>

          <Col xs="6">
            <h5>{Translator('ANNOTATIONS').toUpperCase()}</h5>
            <AnnotationContainer>
              {orderListItemsNotes.split('\n').map((line) => (
                <span style={{display: 'block'}} key={btoa(line)}>
                  {line}
                </span>
              ))}
            </AnnotationContainer>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Report;
