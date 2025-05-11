import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo';
import GET_ALL_FORTUNE_COOKIES from '../graphql/fortuneCookies.graphql';
import { Table } from 'vtex.styleguide';
import { MessageDescriptor, useIntl } from 'react-intl';
import { IDataCookies, IcookieItem } from '../typings/cookies';
import { messages } from '../config/config';

export const CookiesTable = () => {
  const { data } = useQuery<IDataCookies>(GET_ALL_FORTUNE_COOKIES);
  const [ items, setItems ] = useState<IcookieItem[]>([]);
  const intl = useIntl();

  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message);

  useEffect(() => {
    const formatedItems = data?.getFortuneCookies?.map((cookie: any) => ({
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

  return (
    <div className="ph10 pv6">
      <h2>Galletas de la Fortuna</h2>
      <Table
        fullWidth
        items={items}
        schema={schema}
      />
    </div>
  )
};
