import { ModalDialog } from 'vtex.styleguide';
import { MessageDescriptor, useIntl } from 'react-intl';
import { messages } from '../messages';

interface IDeleteModalProps {
    isDialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    isDeleting: boolean;
    selectedId: string;
    deleteCookie: any;
}

export const DeleteModal = ({
    isDialogOpen, 
    setDialogOpen, 
    isDeleting,
    selectedId, 
    deleteCookie
}: IDeleteModalProps) => {
    const intl = useIntl();
    const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message);

    return(
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
    );
};