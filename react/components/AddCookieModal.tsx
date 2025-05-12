import { Modal, Button, Input } from 'vtex.styleguide';
import { MessageDescriptor, useIntl } from 'react-intl';
import { messages } from '../messages';

interface IAddModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
    isLoading: boolean;
    handleAddCookie: () => void;
    newPhrase: string;
    setNewPhrase: (phrase: string) => void;
}

export const AddModal = ({
    isModalOpen, 
    closeModal, 
    isLoading, 
    handleAddCookie, 
    newPhrase, 
    setNewPhrase
}: IAddModalProps) => {
    const intl = useIntl();
    const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message);

    return(
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
    );
};