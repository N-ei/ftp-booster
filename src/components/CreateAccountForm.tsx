import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';

/** components */
import WaitDialog from './WaitDialog';

/** configs */
import { auth } from '../configs/Firebase';

type CreateAccountFormProps = {
    switchLogin: () => void;
}
const CreateAccountForm = ({ switchLogin }: CreateAccountFormProps) => {
    const [mail, setMail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');

    const [waitVisible, setWeitVisible] = React.useState(false);

    const createUser = () => {
        // スピナー開始
        setWeitVisible(true);
        auth.createUserWithEmailAndPassword(mail, password)
            .then(() => {
                console.log('ユーザの作成成功');
                // スピナー停止
                setWeitVisible(false);
            }).catch(({ message }) => {
                console.log(message);
                // スピナー停止
                setWeitVisible(false);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>アカウントを作成する</Text>
            <TextInput
                label='メールアドレス'
                placeholder='ftp.booster@example.com'
                value={mail}
                onChangeText={setMail}
                style={styles.contents}
            />
            <TextInput
                label='パスワード'
                placeholder='********'
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
                style={styles.contents}
            />
            <TextInput
                label='パスワード(確認) '
                placeholder='********'
                value={passwordConfirm}
                secureTextEntry={true}
                onChangeText={setPasswordConfirm}
                style={styles.contents}
            />
            <Button
                mode="contained"
                onPress={() => createUser()}
                style={styles.contents}>
                登録
            </Button>

            <Divider style={styles.contents} />

            <Button
                mode="text"
                onPress={() => switchLogin()}
                style={styles.contents}>
                戻る
            </Button>
            <WaitDialog visible={waitVisible}></WaitDialog>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    contents: {
        marginTop: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        textAlign: 'center'
    }
});

export default CreateAccountForm;
