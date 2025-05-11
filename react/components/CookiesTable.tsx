import React, { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation } from 'react-apollo';
import GET_ALL_FORTUNE_COOKIES from '../graphql/fortuneCookies.graphql';
import ADD_COOKIE_FORTUNE from '../graphql/addCookieFortune.graphql';
import { Table, Modal, Button, Input } from 'vtex.styleguide';
import { MessageDescriptor, useIntl } from 'react-intl';
import { IDataCookies, IcookieItem } from '../typings/cookies';
import { messages } from '../config/config';

export const CookiesTable = () => {
  const { data } = useQuery<IDataCookies>(GET_ALL_FORTUNE_COOKIES);
  const [addCookie, { loading: isLoading }] = useMutation(ADD_COOKIE_FORTUNE, {
    onCompleted: () => {
      setModalOpen(false);
      setNewPhrase('');
    },
    onError: (err: any) => {
      console.log('err: ', err);
    },
  });

  console.log('isLoading: ', isLoading);

  const [ items, setItems ] = useState<IcookieItem[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [newPhrase, setNewPhrase] = useState<string>('');
  const intl = useIntl();

  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    const formatedItems = data?.getFortuneCookies?.map(cookie => ({
      id: cookie.id,
      phrase: cookie.CookieFortune,
    })) || [];

    setItems(formatedItems);
  }, [data]);

  const schema = {
    properties: {
      id: {
        title: translateMessage(messages.id),
      },
      phrase: {
        title: translateMessage(messages.phrase)
      },
    }
  };

  console.log({ Table, Modal, Button, Input });

  return (
    <>
      <div className="ph10 pv6">
        <h2>Galletas de la Fortuna</h2>
        <Button onClick={openModal}>Nueva galleta</Button>

        <Table
          fullWidth
          items={items}
          schema={schema}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        bottomBar={
          <div className="flex flex-end">
            <Button variation="tertiary" onClick={closeModal} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button
              onClick={() => addCookie({ variables: { phrase: newPhrase } })}
            >
              Guardar
            </Button>
          </div>
        }
      >
        <h4>Crear nueva galleta</h4>
        <div>
          <Input
            label="Frase"
            value={newPhrase}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewPhrase(event.target.value)
            }
          />
        </div>
      </Modal>
    </>
  )
};
