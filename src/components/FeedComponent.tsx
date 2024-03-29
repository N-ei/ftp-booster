import React, { useCallback, useState, useEffect, FC } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

/** components */
import SimpleDialog from './SimpleDialog';

/**　configs */
import { FtpDataParam } from '../configs/Types';
import Colors from '../configs/Colors';

/** actions */
import { getFtpDataList, deleteFtpData } from '../actions/FtpDataAction';

type FeedComponentProps = {
    actionFlug: boolean,
}

/** フィードコンポーネント */
const FeedComponent = ({ actionFlug }: FeedComponentProps) => {
    const [ftpDataList, setFtpDataList] = useState<FtpDataParam[]>([]);

    const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>();
    const toggleDialog = () => setDeleteDialogVisible(!deleteDialogVisible);
    const getDeleteDialogVisible = () => !!deleteDialogVisible;

    const [deleteItem, setDeleteItem] = useState<FtpDataParam>();
    const deleteIconPress = (item: FtpDataParam) => {
        toggleDialog();
        setDeleteItem(item);
    }
    const [, setError] = useState();

    /** スクリーンフォーカス時 */
    useFocusEffect(
        useCallback(() => {
            getFtpDataList().then(data => {
                setFtpDataList(data);
            }).catch(error => {
                setError(error);
            });
        }, [])
    );

    /**
     * 一覧データ更新
     * 削除ダイアログを閉じたとき、ftp登録時
     */
    useEffect(() => {
        if (!deleteDialogVisible) {
            getFtpDataList().then(data => {
                setFtpDataList(data);
            }).catch(error => {
                setError(error);
            });
        }
    }, [deleteDialogVisible, actionFlug]);

    /** 削除ボタンアクション */
    const deleteAction = (flug: boolean) => {
        if (!flug || !deleteItem) {
            toggleDialog();
            return;
        }
        // 削除処理
        deleteFtpData(deleteItem.docId).then(() => {
            toggleDialog();
        }).catch(error => {
            setError(error);
        });
    }

    type RenderItemProps = {
        item: FtpDataParam,
    }
    const renderItem = ({ item }: RenderItemProps) => (
        <Layout style={styles.listStyle} >
            <Layout style={styles.iconItemContainer}>
                <ListIcon item={item}></ListIcon>
                <Layout style={styles.itemContainer}>
                    <Text category='s1'>
                        {getFormatDate(item.date)}
                    </Text>
                    <MainItem item={item}></MainItem>
                </Layout>
            </Layout>
            <DeleteItemIcon
                item={item}
                buttonClickAction={deleteIconPress}
            ></DeleteItemIcon>
        </Layout>
    );

    return (
        <>
            <FlatList
                data={ftpDataList}
                renderItem={renderItem}
            />
            <SimpleDialog
                title={getFormatDate(deleteItem?.date) + '\nFTP ' + deleteItem?.ftp + ' W のデータを削除しますか？'}
                okButtonName='削除'
                visible={getDeleteDialogVisible()}
                action={deleteAction}
            />
        </>
    );
};

/** Date型をYYYY/MM/DDの形式で表示する */
const getFormatDate = (date?: Date) => {
    if (date) {
        return date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getDate().toString();
    }
}

type ListIconProps = {
    item: FtpDataParam;
}
/** リストアイコン */
const ListIcon = ({ item }: ListIconProps) => {
    if (item.type === 'ftp') {
        if (item.condition === '良好') {
            return (
                <ListAntDesignIcon name='smileo' color={Colors.tint}></ListAntDesignIcon>
            );
        } else if (item.condition === '普通') {
            return (
                <ListAntDesignIcon name='meh' color={Colors.iconMeh}></ListAntDesignIcon>
            );
        } else if (item.condition === '悪い') {
            return (
                <ListAntDesignIcon name='frowno' color={Colors.iconFrown}></ListAntDesignIcon>
            );
        }
    } else {
        return (
            <ListAntDesignIcon name='star' color={Colors.iconTopic}></ListAntDesignIcon>
        );
    }
    return <></>
}

type ListAntDesignIconProps = {
    name: 'smileo' | 'meh' | 'star' | 'frowno',
    color: string,
}
/** AntDesignアイコン */
const ListAntDesignIcon = ({ name, color }: ListAntDesignIconProps) => {
    return (
        <AntDesign
            name={name}
            size={32}
            color={color}
        ></AntDesign>
    );
}

type MainItem = {
    item: FtpDataParam;
}

/** データ表示部 */
const MainItem = ({ item }: MainItem) => {
    if (item.type === 'ftp' && item.ftp && item.weight) {
        return (
            <Layout style={[styles.flexContainer]}>
                <DispData name='FTP' data={item.ftp.toString()} unit='W'></DispData>
                <DispData name='体重' data={item.weight.toString()} unit='kg'></DispData>
                <DispData name='PWR' data={(item.ftp / item.weight).toFixed(1).toString()} unit='W/kg'></DispData>
            </Layout>
        );
    } else {
        return (
            <Layout style={{ flexDirection: 'row' }}>
                <Text style={{ width: 0, flexGrow: 1 }}>{item.message}</Text>
            </Layout>
        );
    }
}

type DispDataProps = {
    name: string,
    data: string,
    unit: string,
}
/** データ */
const DispData = ({ name, data, unit }: DispDataProps) => {
    return (
        <Layout>
            <Text style={styles.textDataName} category='c2'>{name}</Text>
            <Text>{data} {unit}</Text>
        </Layout>
    );
}

type DeleteIconProps = {
    buttonClickAction: (item: FtpDataParam) => void;
    item: FtpDataParam;
}
const DeleteItemIcon: FC<DeleteIconProps> = ({ item, buttonClickAction }: DeleteIconProps) => {
    if (item.type === 'ftp') {
        return (
            <AntDesign
                name='delete'
                size={32}
                onPress={() => buttonClickAction(item)}
                color='gray'
            ></AntDesign>);
    } else {
        return <></>
    }

}

const styles = StyleSheet.create({
    listStyle: {
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
    },
    itemContainer: {
        marginLeft: 8,
        marginRight: 8,
        flexGrow: 0.8,
    },
    flexContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexGrow: {
        flexGrow: 1
    },
    listIcon: {
        width: 32,
        height: 32,
    },
    textDataName: {
        textAlign: 'center',
    }

});

export default FeedComponent
