import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../components/ui/dropdown-menu';
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "./utils";
import { editFileAccess, giveFileAccess, removeFileAccess } from "../../store/file/action";
import { useNavigate } from "react-router-dom";

const ShareModal = ({ isOpen, onClose, fileName, copyLink, users, fileId }) => {
    const [userInput, setUserInput] = useState('');
    const [showSuggestion, setShowSuggestions] = useState(false);
    const [accessList, setAccessList] = useState([]);
    const fileAccessList = useSelector((store) => store?.file?.fileAccessList ?? [])
    const [expiryInput, setExpiryInput] = useState(''); // New state for custom expiry input
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const suggestions = users.map((user) => {
      if (user?.role == "guest")
        return (user?.email ?? "") + " (Guest)"
      return user?.email ?? ""
    });
    console.log("suggestion ", suggestions)
    const handleAddUser = (email) => {
        dispatch(giveFileAccess(fileId, email, navigate))
        setUserInput('');
        setShowSuggestions(false)
    };
  
    const handleRemoveAccess = (email) => {
        dispatch(removeFileAccess(fileId, email, navigate))
    };
  
    const handleSetExpiry = (email, newExpiry) => {
      dispatch(editFileAccess(fileId, email, newExpiry))
    };
  
    const handleCustomExpiry = (user) => {
      if (expiryInput) {
        handleSetExpiry(user, expiryInput);
        setExpiryInput(''); // Clear input after setting expiry
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">Share <i>"{fileName}"</i></DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium" htmlFor="user-input">Add User</Label>
              <Input
                id="user-input"
                value={userInput}
                className="mt-[10px]"
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter user email"
                onClick={(e) => setShowSuggestions((prev) => !prev)}
              />
              {showSuggestion && (
                <div className="mt-2 space-y-1">
                  {users
                    .filter((user) =>
                      !userInput || user?.email?.toLowerCase().includes(userInput.toLowerCase())
                    )
                    .map((user, index) => (
                      <div
                        key={index}
                        className="cursor-pointer text-sm p-2 bg-gray-500 hover:bg-gray-700 rounded"
                        onClick={() => handleAddUser(user?.email)}
                      >
                        {user?.role == 'guest' ? (user?.email ?? "") + " (Guest)" : (user?.email ?? "")}
                      </div>
                    ))}
                </div>
              )}
            </div>
  
            <div className="space-y-2">
                <div className="text-base font-medium"> People with Access</div>
              {fileAccessList.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p className="text-sm">{item.user_email}</p>
                    <p className="text-sm text-muted-foreground">Expiry: {item?.expiration_time ? formatDate(item.expiration_time) : "Not Set"}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="sm">
                        ...
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleRemoveAccess(item.user_email)}>
                        Remove Access
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetExpiry(item.user_email, 1)}>
                        Set Expiry: 1 Day
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetExpiry(item.user_email, 7)}>
                        Set Expiry: 7 Days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetExpiry(item.user_email, 30)}>
                        Set Expiry: 30 Days
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSetExpiry(item.user_email)}>
                        Set Expiry: No Expiry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={copyLink}>
              Copy Link
            </Button>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default ShareModal;
