import React, { useState, useEffect } from "react";
import { createNewCup, GetCupNames } from "../../../firebase/cups/CupService";
import Cup from "../../../types/Cup";
import { NewCupButton } from "../AdminConsoleStyles";
import { Entity } from "../../../types/Entity";

const LOADING = "loading";
const IDLE = "idle";
const ERROR = "error";

const CreateCupButton: React.FunctionComponent = (props: {
    cups: Entity<Cup>[];
}) => {
    const [status, setStatus] = useState({ status: IDLE });
    const [newCupName, setNewCupName] = useState<string>("");
    const [allCupNames, setAllCupNames] = useState<string[]>([]);

    useEffect(() => {
        GetCupNames()
            .then((res: string[]) => {
                setAllCupNames(res);
            })
            .catch((e) => console.log(e));
    }, [GetCupNames, setAllCupNames]);

    const handleCreateClick = () => {
        setStatus({ status: LOADING });
        const newCup: Cup = {
            isPublished: false,
            isOpen: false,
            timeCreated: new Date(),
            name: newCupName,
            timePublished: null,
        };
        try {
            createNewCup(newCup);
            setNewCupName("");
        } catch (error) {
            console.log(error.toString());
        }
        setStatus({ status: IDLE });
    };

    const handleNCNChange = (event) => {
        setNewCupName(event.target.value);
    };

    if (props.cups.length == 0) {
        return (
            <form>
                <input
                    value={newCupName}
                    onChange={handleNCNChange}
                    placeholder="Name your new Cup..."
                />
                <NewCupButton
                    type="submit"
                    className="btn-createCup"
                    onClick={() => handleCreateClick()}
                    disabled={
                        status.status === LOADING || newCupName.length == 0
                    }
                >
                    + New SnapCup
                </NewCupButton>
            </form>
        );
    } else {
        return null;
    }
};

export default CreateCupButton;
