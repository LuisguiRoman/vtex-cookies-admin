import React, { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import GET_ALL_FORTUNE_COOKIES from '../graphql/getCookies.graphql';
import ADD_COOKIE_FORTUNE from '../graphql/addCookieFortune.graphql';
import DELETE_COOKIE_FORTUNE from '../graphql/deleteCookieFortune.graphql';
import { Table, Spinner, ButtonWithIcon, IconDelete } from 'vtex.styleguide';
import { MessageDescriptor, useIntl } from 'react-intl';
import { IcookieItem, CreateDocumentVars } from '../typings/cookies';
import { messages } from '../messages';
import { AddModal } from './AddCookieModal';
import { DeleteModal } from './DeleteCookieModal';
import { parseFortunes } from '../utils';
import { masterdataConfig } from '../config';


export const FortuneCookies = () => {
  const { acronym, fields, pageSize, mainField } = masterdataConfig;
  const [ items, setItems ] = useState<IcookieItem[]>([]);
  const [ isModalOpen, setModalOpen ] = useState<boolean>(false);
  const [ isDialogOpen, setDialogOpen ] = useState<boolean>(false);
  const [ newPhrase, setNewPhrase ] = useState<string>('');
  const [ selectedId, setSelectedId ] = useState<string>('');
  const intl = useIntl();

  const { data, loading: isTableLoading } = useQuery(GET_ALL_FORTUNE_COOKIES, {
    fetchPolicy: 'no-cache',
    context: {
      fetchOptions: {
        cache: 'no-store'
      },
    },
    variables: {
      acronym,
      fields,
      pageSize
    }
  });

  const [ addCookie, { loading: isLoading } ] = useMutation<
  { createDocument: { documentId: string } }, CreateDocumentVars>(ADD_COOKIE_FORTUNE, {
      onCompleted: (data) => {
        const newCookie = {
          id: data?.createDocument?.documentId || '',
          phrase: newPhrase
        };
        handleAddItem(newCookie);
      }
  });

  // not working bad request
  const [ deleteCookie, { loading: isDeleting } ] = useMutation(DELETE_COOKIE_FORTUNE, {
    context: {
      clientName: 'store-graphql',
      fetchOptions: {
        credentials: 'include',
      },
    },
      onCompleted: (data) => {
        handleDeleteItem(data?.deleteDocument?.documentId);
      }
    }
  );
  
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleAddCookie = () => {
    if(newPhrase && newPhrase?.trim()){
      addCookie({
        variables: {
          acronym,
          document: {
            fields: { key: mainField, value: newPhrase },
          },
        },
      });
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
    const formatedItems = parseFortunes(data);
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
