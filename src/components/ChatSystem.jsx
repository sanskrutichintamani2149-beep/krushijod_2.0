import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Phone, User, MessageSquare, ShieldCheck } from 'lucide-react';

export const ChatSystem = () => {
  const { t, chats, activeChatId, setActiveChatId, sendMessage, userRole } = useApp();
  const [inputMsg, setInputMsg] = useState("");

  const activeChat = chats.find(c => c.chatId === activeChatId) || chats[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeChat) return;
    sendMessage(activeChat.chatId, inputMsg);
    setInputMsg("");
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
      
      {/* Left Sidebar - Active Chats List */}
      <div className="md:col-span-4 border-r border-stone-200 bg-stone-50/50 flex flex-col">
        <div className="p-4 border-b border-stone-200 bg-white">
          <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2 font-serif">
            <MessageSquare className="w-4 h-4 text-[#2D6A4F]" />
            <span>{t.activeChats}</span>
          </h3>
        </div>

        <div className="divide-y divide-stone-100 overflow-y-auto flex-1">
          {chats.map(chat => (
            <div
              key={chat.chatId}
              onClick={() => setActiveChatId(chat.chatId)}
              className={`p-4 cursor-pointer transition-all ${
                activeChatId === chat.chatId
                  ? 'bg-emerald-50/80 border-l-4 border-[#143E24]'
                  : 'hover:bg-stone-100/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-bold text-stone-900 leading-snug">{chat.peerName}</h4>
                <span className="text-[10px] font-semibold text-stone-400">{chat.time}</span>
              </div>
              
              <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded mt-1">
                {chat.peerRole}
              </span>

              <p className="text-xs text-stone-500 truncate mt-1.5">
                {chat.lastMsg}
              </p>

              <div className="text-[11px] text-stone-600 font-medium mt-1 flex items-center">
                <Phone className="w-3 h-3 text-stone-400 mr-1" />
                {chat.peerPhone}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Main Chat Window */}
      <div className="md:col-span-8 flex flex-col bg-white">
        
        {activeChat ? (
          <>
            {/* Peer Header with Visible Mobile Number */}
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#143E24] text-white flex items-center justify-center font-bold shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center">
                    {activeChat.peerName}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1.5" />
                  </h3>
                  <div className="flex items-center text-xs font-semibold text-emerald-800 space-x-2 mt-0.5">
                    <span className="flex items-center">
                      <Phone className="w-3 h-3 mr-1 text-emerald-600" />
                      {activeChat.peerPhone}
                    </span>
                    <span>• {activeChat.peerRole}</span>
                  </div>
                </div>
              </div>

              <a
                href={`tel:${activeChat.peerPhone}`}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-all"
              >
                <Phone className="w-3 h-3" />
                <span>{t.callBtn}</span>
              </a>
            </div>

            {/* Message History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F8F9FA]">
              {activeChat.messages.map((msg, index) => {
                const isMe = msg.sender === userRole || msg.sender === 'Farmer';
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-[#143E24] text-white rounded-br-none'
                          : 'bg-white border border-stone-200 text-stone-900 rounded-bl-none'
                      }`}
                    >
                      <span className="text-[9px] font-bold block opacity-70 mb-0.5">{msg.sender}</span>
                      <p className="font-medium text-sm">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-stone-200 bg-white flex items-center space-x-3">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={t.typeMessage}
                className="flex-1 bg-stone-100 border border-stone-300 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#143E24]"
              />
              <button
                type="submit"
                className="bg-[#143E24] hover:bg-[#215A36] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <span>{t.send}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-stone-400 text-xs">
            Select a conversation to begin chat.
          </div>
        )}

      </div>

    </div>
  );
};
