import { IItem } from './index';
import { useState } from 'react';

interface IItemWithType extends IItem {
    isEdit: boolean;
    buffer: string;
}

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    const initList = (data: IItem[]): IItemWithType[] =>
        data.map(
            (item: IItem): IItemWithType => ({
                ...item,
                isEdit: false,
                buffer: '',
            }),
        );
    const [list, setList] = useState(initList(props.initialData));

    const sortItems = (a: IItem, b: IItem): number =>
        props.sorting === 'ASC' ? a.id - b.id : b.id - a.id;
    const edit = (id: number) => {
        setList((list) =>
            list.map((item) =>
                item.id === id ? { ...item, isEdit: true } : { ...item },
            ),
        );
    };
    const keyHandler = (
        id: number,
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        event.preventDefault();
        if (event.code === 'Enter') {
            setList((list) =>
                list.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              name: item.buffer,
                              buffer: '',
                              isEdit: false,
                          }
                        : { ...item },
                ),
            );
        } else if (event.code === 'Escape') {
            setList((list) =>
                list.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              name: item.name,
                              buffer: '',
                              isEdit: false,
                          }
                        : { ...item },
                ),
            );
        }
    };

    const resultList = list.sort(sortItems).map((item) => {
        let listItem;
        if (item.isEdit) {
            listItem = (
                <input
                    defaultValue={item.name}
                    onInput={(event) =>
                        setList((list) =>
                            list.map((element) =>
                                item.id === element.id
                                    ? {
                                          ...element,
                                          isEdit: true,
                                          buffer: (
                                              event.target as HTMLInputElement
                                          ).value,
                                      }
                                    : { ...element },
                            ),
                        )
                    }
                    onKeyUp={(event) => {
                        keyHandler(item.id, event);
                    }}
                />
            );
        } else {
            listItem = <span onClick={() => edit(item.id)}>{item.name}</span>;
        }
        return <li key={item.id}>{listItem}</li>;
    });

    return <ul>{resultList}</ul>;
}
