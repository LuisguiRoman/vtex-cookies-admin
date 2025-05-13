import React, { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation } from 'react-apollo';
import GET_ALL_FORTUNE_COOKIES from '../graphql/fortuneCookies.graphql';
import ADD_COOKIE_FORTUNE from '../graphql/addCookieFortune.graphql';
import DELETE_COOKIE_FORTUNE from '../graphql/deleteCookieFortune.graphql';
import { Table, Spinner, ButtonWithIcon, IconDelete } from 'vtex.styleguide';
import { MessageDescriptor, useIntl } from 'react-intl';
import { IDataCookies, IcookieItem } from '../typings/cookies';
import { messages } from '../messages';
import { AddModal } from './AddCookieModal';
import { DeleteModal } from './DeleteCookieModal';


export const FortuneCookies = () => {
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
    if(newPhrase && newPhrase?.trim()){
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
        width: 150,
        cellRenderer: ({ rowData }: any) => {
          return (
            <ButtonWithIcon 
              className="ttc center" 
              size="small" 
              variation="danger"
              icon={<IconDelete />}
              onClick={() => handleDeleteCookie(rowData.id)} />
          )
        },
      }
    }
  };

  return (
    <>
      <div className="ph4 pv8 w-100 w-90-s w-70-l center">
        <h2 className="f3 mb6">
          {translateMessage(messages.pageTitle)}
        </h2>

        <div className="flex items-center justify-center flex-column">
            {isTableLoading ? (
              <Spinner />
            ): (
              <div className="w-100">
                <Table
                  toolbar={{
                    newLine: {
                      label: translateMessage(messages.addCookie),
                      handleCallback: openModal,
                    }
                  }}
                  fullWidth={true}
                  items={items}
                  schema={schema}
                />
              </div>
            )}
        </div>
      </div>

      <AddModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        isLoading={isLoading}
        handleAddCookie={handleAddCookie}
        newPhrase={newPhrase}
        setNewPhrase={setNewPhrase}
       />

      <DeleteModal 
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        isDeleting={isDeleting}
        selectedId={selectedId}
        deleteCookie={deleteCookie}
      />
    </>
  )
};
