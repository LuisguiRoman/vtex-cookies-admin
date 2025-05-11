import React, { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation } from 'react-apollo';
import GET_ALL_FORTUNE_COOKIES from '../graphql/fortuneCookies.graphql';
import ADD_COOKIE_FORTUNE from '../graphql/addCookieFortune.graphql';
import DELETE_COOKIE_FORTUNE from '../graphql/deleteCookieFortune.graphql';
import { Table, Modal, Button, Input, Spinner, ModalDialog } from 'vtex.styleguide';
import { MessageDescriptor, useIntl } from 'react-intl';
import { IDataCookies, IcookieItem } from '../typings/cookies';
import { messages } from '../messages';

export const CookiesTable = () => {
  const [ items, setItems ] = useState<IcookieItem[]>([]);
  const [ isModalOpen, setModalOpen ] = useState<boolean>(false);
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [ newPhrase, setNewPhrase ] = useState<string>('');
  const [ selectedId, setSelectedId ] = useState<string>('');
  const intl = useIntl();

  const { data, loading: isTableLoading } = useQuery<IDataCookies>(GET_ALL_FORTUNE_COOKIES);
  const [ addCookie, { loading: isLoading } ] = useMutation(ADD_COOKIE_FORTUNE, {
    onCompleted: (data) => {
      handleAddItem(data?.addFortuneCookie);
    }
  });
  const [ deleteCookie, { loading: isDeleting } ] = useMutation(DELETE_COOKIE_FORTUNE,{
      onCompleted: (data) => {
        handleDeleteItem(data?.deleteFortuneCookie?.id);
      }
    }
  );
  
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleAddCookie = () => {
    if(newPhrase){
      addCookie({ variables: { phrase: newPhrase } });
    }
  }

  const handleDeleteCookie = (id: string) => {
    setSelectedId(id);
    setDialogOpen(true);
  }
  
  const handleAddItem = (newCookie: IcookieItem) => {
    setItems([...items, newCookie]);
    setModalOpen(false);
    setNewPhrase('');
  }

  const handleDeleteItem = (idDeleted: string) => {
    const newItems = items.filter(item => item.id !== idDeleted);
    setItems(newItems);
    setDialogOpen(false);
  }

  useEffect(() => {
    const formatedItems = data?.getFortuneCookies?.map(cookie => ({
      id: cookie.id,
      phrase: cookie.CookieFortune,
    })) || [];

    setItems(formatedItems);
  }, [data]);

  const schema = {
    properties: {
      phrase: {
        title: translateMessage(messages.phrase)
      },
      delete: {
        title: translateMessage(messages.deleteCookie),
        width: 250,
        cellRenderer: ({ rowData }: any) => {
          return (
            <Button className="ttc" size="small" variation="danger-tertiary" 
              onClick={() => handleDeleteCookie(rowData.id)}>
              {translateMessage(messages.delete)}
            </Button>
          )
        },
      }
    }
  };

  if(isTableLoading){
    return <Spinner />
  }

  return (
    <>
      <div className="ph4 ph9-m pv6">
        <h2>{translateMessage(messages.pageTitle)}</h2>
        <Button disabled={isLoading} onClick={openModal}>{translateMessage(messages.addCookie)}</Button>

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
          <div className="flex">
            <Button variation="tertiary" onClick={closeModal}>
              {translateMessage(messages.cancel)}
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleAddCookie}
            >
              {translateMessage(messages.save)}
            </Button>
          </div>
        }
      >
        <h4>{translateMessage(messages.createNewCookie)}</h4>
        <div>
          <Input
            label={translateMessage(messages.phrase)}
            value={newPhrase}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewPhrase(event.target.value)
            }
          />
        </div>
      </Modal>

      <ModalDialog
        centered
        isOpen={isDialogOpen}
        loading={isDeleting}
        confirmation={{
          onClick: () => deleteCookie({ variables: { id: selectedId } }),
          label: translateMessage(messages.deleteCookie),
          isDangerous: true,
        }}
        cancelation={{
          onClick: () => setDialogOpen(false),
          label: translateMessage(messages.cancel),
        }}
        onClose={() => setDialogOpen(false)}
      >
        <p>
          {translateMessage(messages.question)}
        </p>
      </ModalDialog>
    </>
  )
};
